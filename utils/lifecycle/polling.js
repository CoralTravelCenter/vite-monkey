export function waitForCondition(check, options = {}) {
  const { intervalMs = 200, signal, timeoutMs = 10000 } = options;

  if (signal?.aborted) {
    return Promise.reject(
      signal.reason ?? new DOMException("Aborted", "AbortError"),
    );
  }

  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
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
          resolve(value);
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
