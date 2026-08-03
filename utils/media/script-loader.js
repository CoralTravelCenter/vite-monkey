/** @type {Map<string, Promise<HTMLScriptElement>>} */
const pendingScripts = new Map();

/** @param {string} url @param {{removeAfterLoad?: boolean}} [options] */
export function loadScript(url, options = {}) {
  const { removeAfterLoad = false } = options;
  if (!url) return Promise.reject(new TypeError("loadScript requires a URL"));
  if (pendingScripts.has(url)) return pendingScripts.get(url);

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = url;
    script.addEventListener(
      "load",
      () => {
        if (removeAfterLoad) script.remove();
        resolve(script);
      },
      { once: true },
    );
    script.addEventListener(
      "error",
      () => {
        pendingScripts.delete(url);
        script.remove();
        reject(new Error(`Failed to load script: ${url}`));
      },
      { once: true },
    );
    document.head.append(script);
  });

  pendingScripts.set(url, promise);
  return promise;
}
