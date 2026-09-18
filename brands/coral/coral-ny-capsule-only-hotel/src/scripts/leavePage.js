import { dateCheck, isSearchDateEligible } from "./dateCheck.js";

const EXIT_INTENT_EDGE = 48;

export function leavePage() {
  const controller = new AbortController();
  let showOnReturn = false;

  const showPopup = async () => {
    try {
      const isShown = await dateCheck();

      if (isShown) {
        controller.abort();
      }

      return isShown;
    } catch {}

    return false;
  };

  document.addEventListener(
    "mouseleave",
    async (event) => {
      const isTopExit = event.clientY <= EXIT_INTENT_EDGE;
      const isLeftExit = event.clientX <= EXIT_INTENT_EDGE;
      const isRightExit =
        event.clientX >=
        document.documentElement.clientWidth - EXIT_INTENT_EDGE;

      if (!isTopExit && !isLeftExit && !isRightExit) {
        return;
      }

      await showPopup();
    },
    { signal: controller.signal },
  );

  document.addEventListener(
    "visibilitychange",
    async () => {
      if (document.visibilityState === "hidden") {
        showOnReturn = isSearchDateEligible();
        return;
      }

      if (showOnReturn) {
        showOnReturn = false;
        await showPopup();
      }
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
