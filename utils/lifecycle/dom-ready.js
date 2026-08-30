export async function asap(callback) {
  if (["complete", "interactive"].includes(document.readyState)) {
    callback?.();
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        callback?.();
        resolve(undefined);
      },
      { once: true },
    );
  });
}
