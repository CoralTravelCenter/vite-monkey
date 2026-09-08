import { reactDomObserver } from "@utils";
import { WATCH_SELECTOR } from "./utils/keys.js";
import { removeFaq } from "./targetingBlock/removeFaq.js";
import {
  cancelScheduledRender,
  scheduleRender,
} from "./targetingBlock/scheduleRender.js";

export function initWidget() {
  const observer = reactDomObserver();

  const subscription = observer
    .observeSelector$(WATCH_SELECTOR)
    .subscribe(scheduleRender);

  return () => {
    subscription.unsubscribe();
    cancelScheduledRender();
    removeFaq();
  };
}
