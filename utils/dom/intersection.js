import { arrayOfNodesWith } from "./nodes.js";

/** @param {AbortSignal} signal */
function abortReason(signal) {
  return signal.reason ?? new DOMException("Aborted", "AbortError");
}

/**
 * Resolves with the first intersecting entry for a target.
 *
 * @param {Element} target
 * @param {{observerOptions?: IntersectionObserverInit, predicate?: (entry: IntersectionObserverEntry) => boolean, signal?: AbortSignal, timeoutMs?: number}} [options]
 * @returns {Promise<IntersectionObserverEntry>}
 */
export function waitForIntersection(target, options = {}) {
  const {
    observerOptions,
    predicate = (entry) => entry.isIntersecting,
    signal,
    timeoutMs = 10000,
  } = options;

  if (!target) {
    return Promise.reject(
      new TypeError("waitForIntersection requires an observable target"),
    );
  }
  if (signal?.aborted) return Promise.reject(abortReason(signal));

  return new Promise((resolve, reject) => {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timerId = null;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.find(predicate);
      if (!entry) return;
      cleanup();
      resolve(entry);
    }, observerOptions);
    const onAbort = () => {
      cleanup();
      reject(abortReason(signal));
    };
    const cleanup = () => {
      observer.disconnect();
      if (timerId !== null) clearTimeout(timerId);
      signal?.removeEventListener("abort", onAbort);
    };

    observer.observe(target);
    signal?.addEventListener("abort", onAbort, { once: true });
    if (timeoutMs > 0) {
      timerId = setTimeout(() => {
        cleanup();
        reject(new Error(`waitForIntersection timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }
  });
}

export function watchIntersection(targets, options, yes_handler, no_handler) {
  const io = new IntersectionObserver(
    function (entries, observer) {
      for (const entry of entries) {
        entry.isIntersecting
          ? yes_handler?.call(this, entry.target, observer)
          : no_handler?.call(this, entry.target, observer);
      }
    },
    {
      threshold: 1,
      ...options,
    },
  );
  for (const node of arrayOfNodesWith(targets)) {
    io.observe(node);
  }
  return io;
}
