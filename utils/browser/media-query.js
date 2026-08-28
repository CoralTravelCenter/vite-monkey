export function mediaMatcher(size, callback, mode = "min") {
  const mediaQuery = window.matchMedia(`(${mode}-width: ${size}px)`);
  callback(mediaQuery.matches);
  mediaQuery.addEventListener("change", (event) => callback(event.matches));
}
