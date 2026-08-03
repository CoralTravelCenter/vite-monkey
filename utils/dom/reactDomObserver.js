import {
  filter,
  firstValueFrom,
  map,
  Observable,
  share,
  take,
  timeout,
} from "rxjs";
import { observe } from "selector-observer";

export const reactDomObserver = (defaultOptions = {}) => {
  const {
    emitInitialize = true,
    emitAdd = true,
    emitRemove = true,
  } = defaultOptions;

  const observeSelector$ = (selector, options = {}) => {
    const {
      name = selector,
      emitInitialize: shouldEmitInitialize = emitInitialize,
      emitAdd: shouldEmitAdd = emitAdd,
      emitRemove: shouldEmitRemove = emitRemove,
    } = options;

    return new Observable((subscriber) => {
      const observer = observe(selector, {
        initialize(element) {
          if (!shouldEmitInitialize) return;

          subscriber.next({ type: "initialize", selector, name, element });
        },

        add(element) {
          if (!shouldEmitAdd) return;

          subscriber.next({ type: "add", selector, name, element });
        },

        remove(element) {
          if (!shouldEmitRemove) return;

          subscriber.next({ type: "remove", selector, name, element });
        },
      });

      return () => observer.abort();
    }).pipe(share());
  };

  const added$ = (selector, options = {}) => {
    return observeSelector$(selector, options).pipe(
      filter((event) => event.type === "add"),
    );
  };

  const removed$ = (selector, options = {}) => {
    return observeSelector$(selector, options).pipe(
      filter((event) => event.type === "remove"),
    );
  };

  const initialized$ = (selector, options = {}) => {
    return observeSelector$(selector, options).pipe(
      filter((event) => event.type === "initialize"),
    );
  };

  const element$ = (selector, options = {}) => {
    return added$(selector, options).pipe(map((event) => event.element));
  };

  const waitElement$ = (selector, options = {}) => {
    return element$(selector, options).pipe(take(1));
  };

  const waitElement = (selector, options = {}) => {
    const { timeoutMs = 10000, ...watchOptions } = options;

    return firstValueFrom(
      waitElement$(selector, watchOptions).pipe(timeout({ first: timeoutMs })),
    );
  };

  return {
    observeSelector$,
    added$,
    removed$,
    initialized$,
    element$,
    waitElement$,
    waitElement,
  };
};
