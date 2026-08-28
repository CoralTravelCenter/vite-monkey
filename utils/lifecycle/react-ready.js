import { waitForCondition } from "./polling.js";

export async function hostReactAppReady(
  selector = "#__next > div",
  intervalMs = 300,
) {
  return waitForCondition(
    () => {
      const host = document.querySelector(selector);
      return host?.getBoundingClientRect().height ? host : null;
    },
    { intervalMs, timeoutMs: 0 },
  );
}
