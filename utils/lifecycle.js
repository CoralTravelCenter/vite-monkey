/** @param {(() => void) | undefined} cb */
export async function asap(cb) {
  if (["complete", "interactive"].includes(document.readyState)) {
    cb?.();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        cb?.();
        resolve(undefined);
      },
      { once: true },
    );
  });
}

/** @param {(...args: any[]) => unknown} callee */
export function debounce(callee, timeoutMs = 0) {
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timer = null;

  return function perform(...args) {
    const context = this;
    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(() => {
      callee.apply(context, args);
    }, timeoutMs);
  };
}

/**
 * @template T
 * @param {() => T | Promise<T>} check
 * @param {{intervalMs?: number, signal?: AbortSignal, timeoutMs?: number}} [options]
 * @returns {Promise<Awaited<T>>}
 */
export function waitForCondition(check, options = {}) {
  const { intervalMs = 200, signal, timeoutMs = 10000 } = options;

  if (signal?.aborted) {
    return Promise.reject(
      signal.reason ?? new DOMException("Aborted", "AbortError"),
    );
  }

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let timerId;
    const cleanup = () => {
      if (timerId !== undefined) clearTimeout(timerId);
      signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      cleanup();
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    };
    const poll = async () => {
      try {
        const value = await check();
        if (value) {
          cleanup();
          resolve(/** @type {Awaited<T>} */ (value));
          return;
        }
        if (timeoutMs > 0 && Date.now() - startedAt >= timeoutMs) {
          cleanup();
          reject(new Error(`waitForCondition timed out after ${timeoutMs}ms`));
          return;
        }
        timerId = setTimeout(poll, intervalMs);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    signal?.addEventListener("abort", onAbort, { once: true });
    void poll();
  });
}

export async function hostReactAppReady(
  selector = "#__next > div",
  timeout = 300,
) {
  return waitForCondition(
    () => {
      const host = document.querySelector(selector);
      return host?.getBoundingClientRect().height ? host : null;
    },
    { intervalMs: timeout, timeoutMs: 0 },
  );
}

export async function waitSelector(selector, timeout = 200) {
  return waitForCondition(() => document.querySelector(selector), {
    intervalMs: timeout,
    timeoutMs: 0,
  });
}

// Backward compatibility with old typo in utils.js
export const waiteSelector = waitSelector;

export async function waitForLibrary(getterFn, timeout = 200) {
  return waitForCondition(getterFn, { intervalMs: timeout, timeoutMs: 0 });
}

export function waitForWindowVar(name, intervalMs = 300) {
  return waitForCondition(() => window[name], { intervalMs, timeoutMs: 0 });
}
