/** @param {AbortSignal} signal */
function abortReason(signal) {
  return signal.reason ?? new DOMException("Aborted", "AbortError");
}

/**
 * Resolves after the first matching DOM mutation.
 *
 * @param {Node} target
 * @param {{observerOptions?: MutationObserverInit, predicate?: (records: MutationRecord[], observer: MutationObserver) => boolean, signal?: AbortSignal, timeoutMs?: number}} [options]
 * @returns {Promise<MutationRecord[]>}
 */
export function waitForMutation(target, options = {}) {
  const {
    observerOptions = { childList: true, subtree: true },
    predicate = () => true,
    signal,
    timeoutMs = 10000,
  } = options;

  if (!target) {
    return Promise.reject(
      new TypeError("waitForMutation requires an observable target"),
    );
  }

  if (signal?.aborted) {
    return Promise.reject(abortReason(signal));
  }

  return new Promise((resolve, reject) => {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timerId = null;
    const observer = new MutationObserver((records) => {
      try {
        if (!predicate(records, observer)) return;
        cleanup();
        resolve(records);
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
    const onAbort = () => {
      cleanup();
      reject(abortReason(signal));
    };
    const cleanup = () => {
      observer.disconnect();
      if (timerId !== null) clearTimeout(timerId);
      signal?.removeEventListener("abort", onAbort);
    };

    observer.observe(target, observerOptions);
    signal?.addEventListener("abort", onAbort, { once: true });

    if (timeoutMs > 0) {
      timerId = setTimeout(() => {
        cleanup();
        reject(new Error(`waitForMutation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    }
  });
}

/**
 * Resolves when an element matching selector exists below root.
 *
 * @template {Element} T
 * @param {string} selector
 * @param {{root?: Document | Element, signal?: AbortSignal, timeoutMs?: number}} [options]
 * @returns {Promise<T>}
 */
export function waitForElement(selector, options = {}) {
  const { root = document, signal, timeoutMs = 10000 } = options;

  if (!root || typeof root.querySelector !== "function") {
    return Promise.reject(
      new TypeError("waitForElement requires a queryable root"),
    );
  }

  const current = root.querySelector(selector);
  if (current) return Promise.resolve(/** @type {T} */ (current));

  const target =
    root.nodeType === Node.DOCUMENT_NODE
      ? /** @type {Document} */ (root).documentElement
      : root;
  return waitForMutation(target, {
    signal,
    timeoutMs,
    predicate: () => Boolean(root.querySelector(selector)),
  }).then(() => /** @type {T} */ (root.querySelector(selector)));
}
