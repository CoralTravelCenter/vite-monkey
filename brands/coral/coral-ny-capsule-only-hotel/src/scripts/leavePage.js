import { dateCheck, isSearchDateEligible } from "./dateCheck.js";

const EXIT_INTENT_EDGE = 48;

export function leavePage() {
  const root = document.documentElement;
  let showOnReturn = false;
  let isShowing = false;
  let isDestroyed = false;

  const isExitEdge = (event) => {
    const viewportWidth = root.clientWidth || window.innerWidth;
    const isTopExit = event.clientY <= EXIT_INTENT_EDGE;
    const isLeftExit = event.clientX <= EXIT_INTENT_EDGE;
    const isRightExit = event.clientX >= viewportWidth - EXIT_INTENT_EDGE;

    return isTopExit || isLeftExit || isRightExit;
  };

  const destroy = () => {
    if (isDestroyed) {
      return;
    }

    isDestroyed = true;
    root.removeEventListener("mouseleave", onMouseLeave);
    document.removeEventListener("mouseout", onMouseOut);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };

  const showPopup = async () => {
    if (isShowing || isDestroyed) {
      return false;
    }

    isShowing = true;

    try {
      const isShown = await dateCheck();

      if (isShown) {
        destroy();
      }

      return isShown;
    } catch {
    } finally {
      isShowing = false;
    }

    return false;
  };

  function onMouseLeave(event) {
    if (isExitEdge(event)) {
      void showPopup();
    }
  }

  function onMouseOut(event) {
    if (event.relatedTarget === null && isExitEdge(event)) {
      void showPopup();
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      showOnReturn = isSearchDateEligible();
      return;
    }

    if (showOnReturn) {
      showOnReturn = false;
      void showPopup();
    }
  }

  root.addEventListener("mouseleave", onMouseLeave);
  document.addEventListener("mouseout", onMouseOut);
  document.addEventListener("visibilitychange", onVisibilityChange);

  return destroy;
}
