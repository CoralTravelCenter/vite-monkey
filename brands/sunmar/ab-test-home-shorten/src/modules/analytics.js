import {fromEvent, map, startWith, throttleTime} from 'rxjs';

import {
  COUNTER_ID,
  THROTTLE_DELAY,
  SCROLL_GOALS,
  SCROLL_THRESHOLDS,
} from './constants.js';

function getScrollProgressPercent() {
  const documentElement = document.documentElement;
  const body = document.body;

  const scrollTop =
    window.scrollY ||
    documentElement.scrollTop ||
    body.scrollTop ||
    0;

  const viewportHeight =
    window.innerHeight ||
    documentElement.clientHeight ||
    0;

  const scrollHeight = Math.max(
    documentElement.scrollHeight,
    body.scrollHeight,
    documentElement.offsetHeight,
    body.offsetHeight,
    documentElement.clientHeight
  );

  const maxScrollableDistance = scrollHeight - viewportHeight;

  if (maxScrollableDistance <= 0) {
    return 100;
  }

  const percent = (scrollTop / maxScrollableDistance) * 100;

  return Math.min(100, Math.max(0, percent));
}

export function initScrollGoalTracking() {
  if (window.__miniPageScrollGoalInitialized) {
    return;
  }

  window.__miniPageScrollGoalInitialized = true;

  const sentThresholds = new Set();

  const sendScrollGoal = threshold => {
    const goalName = SCROLL_GOALS[threshold];

    if (!goalName) {
      return;
    }

    window.ym?.(COUNTER_ID, 'reachGoal', goalName, {
      scroll: String(threshold),
    });
  };

  const isThresholdReached = (scrollPercent, threshold) => {
    if (threshold === 100) {
      return scrollPercent >= 98;
    }

    return scrollPercent >= threshold;
  };

  const sendReachedGoals = scrollPercent => {
    SCROLL_THRESHOLDS.forEach(threshold => {
      if (
        !sentThresholds.has(threshold) &&
        isThresholdReached(scrollPercent, threshold)
      ) {
        sentThresholds.add(threshold);
        sendScrollGoal(threshold);
      }
    });
  };

  const subscription = fromEvent(window, 'scroll', {
    passive: true,
  })
    .pipe(
      startWith(null),
      throttleTime(THROTTLE_DELAY, undefined, {
        leading: true,
        trailing: true,
      }),
      map(() => getScrollProgressPercent())
    )
    .subscribe(scrollPercent => {
      sendReachedGoals(scrollPercent);

      if (sentThresholds.size === SCROLL_THRESHOLDS.length) {
        subscription.unsubscribe();
      }
    });
}

export function sendExperimentGoal() {
  window.ym?.(COUNTER_ID, 'reachGoal', 'min_home_page_group_B');
}
