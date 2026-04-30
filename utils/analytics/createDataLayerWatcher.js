import { Observable, filter, firstValueFrom, map, share, take, timeout } from 'rxjs';

let watcherInstance = null;

export const createDataLayerWatcher = (options = {}) => {
    if (watcherInstance) {
        return watcherInstance;
    }

    const { dataLayerName = 'dataLayer', replay = true } = options;
    const w = window;

    w[dataLayerName] = w[dataLayerName] || [];

    const dataLayer = w[dataLayerName];
    const listeners = new Set();
    const originalPush = dataLayer.push.bind(dataLayer);

    const emit = (item, source = 'push') => {
        listeners.forEach((listener) => {
            try {
                listener(item, source);
            } catch (error) {
                console.error('[dataLayerWatcher] listener error:', error);
            }
        });
    };

    dataLayer.push = function (...items) {
        const result = originalPush(...items);

        items.forEach((item) => {
            if (item && typeof item === 'object') {
                emit(item, 'push');
            }
        });

        return result;
    };

    const subscribe = (listener, subscribeOptions = {}) => {
        const { replay: shouldReplay = replay } = subscribeOptions;

        listeners.add(listener);

        if (shouldReplay) {
            dataLayer.forEach((item) => {
                if (item && typeof item === 'object') {
                    listener(item, 'replay');
                }
            });
        }

        return () => listeners.delete(listener);
    };

    const dataLayer$ = new Observable((subscriber) => {
        const unsubscribe = subscribe((item, source) => {
            subscriber.next({ item, source });
        });

        return () => unsubscribe();
    }).pipe(share());

    const event$ = (eventName) => {
        return dataLayer$.pipe(
            map(({ item }) => item),
            filter((item) => item?.event === eventName)
        );
    };

    const waitEvent$ = (eventName) => {
        return event$(eventName).pipe(take(1));
    };

    const waitEvent = (eventName, waitOptions = {}) => {
        const { timeoutMs = 10000 } = waitOptions;

        return firstValueFrom(
            waitEvent$(eventName).pipe(
                timeout({ first: timeoutMs })
            )
        );
    };

    const getLastEvent = (eventName) => {
        for (let i = dataLayer.length - 1; i >= 0; i -= 1) {
            const item = dataLayer[i];

            if (item?.event === eventName) {
                return item;
            }
        }

        return null;
    };

    const destroy = () => {
        dataLayer.push = originalPush;
        listeners.clear();
        watcherInstance = null;
    };

    watcherInstance = {
        dataLayer,
        dataLayer$,
        event$,
        waitEvent$,
        waitEvent,
        getLastEvent,
        subscribe,
        destroy,
    };

    return watcherInstance;
};
