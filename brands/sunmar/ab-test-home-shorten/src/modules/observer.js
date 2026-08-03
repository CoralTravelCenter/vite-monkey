import { Observable, animationFrameScheduler, auditTime, filter } from "rxjs";

import { ORIGINAL_SLIDE_SELECTOR, MINI_PAGE_BLOCKS } from "./constants.js";

export function hasFirstOriginalSlide() {
  return Boolean(document.querySelector(ORIGINAL_SLIDE_SELECTOR));
}

function shouldRunCleanup(mutations) {
  return mutations.some((mutation) => {
    return Array.from(mutation.addedNodes).some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
      }

      return (
        node.matches?.(ORIGINAL_SLIDE_SELECTOR) ||
        node.querySelector?.(ORIGINAL_SLIDE_SELECTOR) ||
        MINI_PAGE_BLOCKS.some((block) => {
          return (
            node.matches?.(block.selector) ||
            node.querySelector?.(block.selector)
          );
        })
      );
    });
  });
}

export function createCleanupObserver(runCleanup) {
  const mutations$ = new Observable((subscriber) => {
    const observer = new MutationObserver((mutations) => {
      subscriber.next(mutations);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  });

  const subscription = mutations$
    .pipe(
      filter((mutations) => shouldRunCleanup(mutations)),
      auditTime(0, animationFrameScheduler),
    )
    .subscribe(() => {
      runCleanup();
    });

  return subscription;
}
