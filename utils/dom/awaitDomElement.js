export function awaitDomElement(selector, options = {}) {
  const {
    root = document.body,
    timeoutMs = 10000,
  } = options;

  const initialElement = document.querySelector(selector);

  if (initialElement) {
    return Promise.resolve(initialElement);
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);

      if (!element) return;

      clearTimeout(timerId);
      observer.disconnect();
      resolve(element);
    });

    const timerId = timeoutMs > 0
      ? setTimeout(() => {
        observer.disconnect();
        reject(new Error(`awaitDomElement timeout: ${selector}`));
      }, timeoutMs)
      : null;

    if (!root) {
      if (timerId) clearTimeout(timerId);
      reject(new Error('awaitDomElement root is not available'));
      return;
    }

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  });
}
