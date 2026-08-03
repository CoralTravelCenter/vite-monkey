import { Observable, share } from "rxjs";
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

  return { observeSelector$ };
};
