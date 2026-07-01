import {filter, firstValueFrom, map, ReplaySubject, Subject, take, timeout,} from 'rxjs';

let watcherInstance = null;

export const createDataLayerWatcher = (options = {}) => {
  if (watcherInstance) {
    return watcherInstance;
  }

  const {dataLayerName = 'dataLayer', replay = true} = options;
  const w = window;

  w[dataLayerName] = w[dataLayerName] || [];
  const dataLayer = w[dataLayerName];
  const originalPush = dataLayer.push.bind(dataLayer);

  const stream$ = replay ? new ReplaySubject() : new Subject();

  if (replay) {
    dataLayer.forEach((item) => {
      if (item && typeof item === 'object') {
        stream$.next({item, source: 'replay'});
      }
    });
  }

  dataLayer.push = function (...items) {
    const result = originalPush(...items);

    items.forEach((item) => {
      if (item && typeof item === 'object') {
        stream$.next({item, source: 'push'});
      }
    });

    return result;
  };

  const dataLayer$ = stream$.asObservable();

  const event$ = (eventName) =>
    dataLayer$.pipe(
      map(({item}) => item),
      filter((item) => item && item.event === eventName)
    );

  const waitEvent = (eventName, waitOptions = {}) => {
    const {timeoutMs = 10000} = waitOptions;

    return firstValueFrom(
      event$(eventName).pipe(
        take(1),
        timeout({first: timeoutMs})
      )
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

  const destroy = () => {
    dataLayer.push = originalPush;
    stream$.complete();
    watcherInstance = null;
  };

  watcherInstance = {
    dataLayer,
    dataLayer$,
    event$,
    waitEvent,
    getLastEvent,
    destroy,
  };

  return watcherInstance;
};
