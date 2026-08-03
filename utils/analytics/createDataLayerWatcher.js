import {
  filter,
  firstValueFrom,
  map,
  ReplaySubject,
  Subject,
  take,
  timeout,
} from "rxjs";

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

  const waitEvent$ = (eventName) => event$(eventName).pipe(take(1));

  const waitEvent = (eventName, waitOptions = {}) => {
    const { timeoutMs = 10000 } = waitOptions;

    return firstValueFrom(
      event$(eventName).pipe(take(1), timeout({ first: timeoutMs })),
    );
  };

  const waitFreshEvent = (eventName, waitOptions = {}) => {
    const { timeoutMs = 10000 } = waitOptions;
    return firstValueFrom(
      dataLayer$.pipe(
        filter(
          ({ item, source }) => source === "push" && item.event === eventName,
        ),
        map(({ item }) => item),
        take(1),
        timeout({ first: timeoutMs }),
      ),
    );
  };

  const getLastEvent = (eventName) => {
    for (let i = dataLayer.length - 1; i >= 0; i -= 1) {
      const item = dataLayer[i];

      if (item && item.event === eventName) {
        return item;
      }
    }

    return null;
  };

  const subscribe = (listener, subscribeOptions = {}) => {
    const { includeReplay = true } = subscribeOptions;
    const subscription = dataLayer$
      .pipe(filter(({ source }) => includeReplay || source !== "replay"))
      .subscribe(({ item, source }) => listener(item, source));
    return () => subscription.unsubscribe();
  };

  const destroy = () => {
    dataLayer.push = originalPush;
    stream$.complete();
    watcherInstances.delete(dataLayerName);
  };

  const watcherInstance = {
    dataLayer,
    dataLayer$,
    event$,
    waitEvent$,
    waitEvent,
    waitFreshEvent,
    getLastEvent,
    subscribe,
    destroy,
  };

  watcherInstances.set(dataLayerName, watcherInstance);
  return watcherInstance;
};
