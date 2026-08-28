export function debounce(callee, timeoutMs = 0) {
  let timer = null;

  return function perform(...args) {
    const context = this;
    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(() => {
      callee.apply(context, args);
    }, timeoutMs);
  };
}
