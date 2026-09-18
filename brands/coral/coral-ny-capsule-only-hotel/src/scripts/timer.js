import { dateCheck } from "./dateCheck.js";

const TIMER_DELAY_MS = 180000;

export function timer() {
  return window.setTimeout(() => {
    void dateCheck();
  }, TIMER_DELAY_MS);
}
