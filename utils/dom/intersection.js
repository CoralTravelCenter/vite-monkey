import { arrayOfNodesWith } from "./nodes.js";
import { observeIntersections$ } from "./observation/intersection.js";

export {
  observeIntersections$,
  waitForIntersection,
} from "./observation/intersection.js";

export function watchIntersection(targets, options, yes_handler, no_handler) {
  const subscription = observeIntersections$(arrayOfNodesWith(targets), {
    threshold: 1,
    ...options,
  }).subscribe((entry) => {
    if (entry.isIntersecting) {
      yes_handler?.(entry.target, subscription);
    } else {
      no_handler?.(entry.target, subscription);
    }
  });

  Object.assign(subscription, {
    disconnect() {
      subscription.unsubscribe();
    },
  });

  return subscription;
}
