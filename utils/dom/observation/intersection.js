import { Observable } from "rxjs";

import { waitForFirst } from "./first-value.js";

export function observeIntersections$(targets, observerOptions) {
  const targetList = Array.isArray(targets) ? targets : [targets];

  return new Observable((subscriber) => {
    if (targetList.length === 0 || targetList.some((target) => !target)) {
      subscriber.error(
        new TypeError("observeIntersections$ requires observable targets"),
      );
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => subscriber.next(entry));
    }, observerOptions);
    targetList.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  });
}

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

  return waitForFirst(observeIntersections$(target, observerOptions), {
    predicate,
    signal,
    timeoutMs,
    timeoutMessage: `waitForIntersection timed out after ${timeoutMs}ms`,
  });
}
