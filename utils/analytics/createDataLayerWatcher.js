import { filter, map, ReplaySubject, Subject } from "rxjs";

const watcherInstances = new Map();

export const createDataLayerWatcher = (options = {}) => {
  const { dataLayerName = "dataLayer", replay = true } = options;
  if (watcherInstances.has(dataLayerName)) {
    return watcherInstances.get(dataLayerName);
  }
  const w = window;

  w[dataLayerName] = w[dataLayerName] || [];
  const dataLayer = w[dataLayerName];
  const originalPush = dataLayer.push;

  const stream$ = replay ? new ReplaySubject() : new Subject();

  if (replay) {
    dataLayer.forEach((item) => {
      if (item && typeof item === "object") {
        stream$.next({ item, source: "replay" });
      }
    });
  }

  dataLayer.push = function (...items) {
    const result = originalPush.apply(dataLayer, items);

    items.forEach((item) => {
      if (item && typeof item === "object") {
        stream$.next({ item, source: "push" });
      }
    });

    return result;
  };

  const dataLayer$ = stream$.asObservable();

  const event$ = (eventName) =>
    dataLayer$.pipe(
      map(({ item }) => item),
      filter((item) => item && item.event === eventName),
    );

  const freshEvent$ = (eventName) =>
    dataLayer$.pipe(
      filter(
        ({ item, source }) => source === "push" && item.event === eventName,
      ),
      map(({ item }) => item),
    );

  const destroy = () => {
    dataLayer.push = originalPush;
    stream$.complete();
    watcherInstances.delete(dataLayerName);
  };

  const watcherInstance = {
    dataLayer$,
    event$,
    freshEvent$,
    destroy,
  };

  watcherInstances.set(dataLayerName, watcherInstance);
  return watcherInstance;
};
