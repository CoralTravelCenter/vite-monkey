import { dateCheck, isSearchDateEligible } from "./dateCheck.js";

const EXIT_INTENT_EDGE = 48;

function getNavigationLink(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const link = event.target?.closest?.("a[href]");

  if (
    !link ||
    link.hasAttribute("download") ||
    (link.target && link.target.toLowerCase() !== "_self")
  ) {
    return null;
  }

  const href = link.getAttribute("href")?.trim();

  if (!href || href.startsWith("#")) {
    return null;
  }

  const url = new URL(link.href, location.href);

  if (!["http:", "https:"].includes(url.protocol)) {
    return null;
  }

  if (
    url.origin === location.origin &&
    url.pathname === location.pathname &&
    url.search === location.search
  ) {
    return null;
  }

  return link;
}

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
    "click",
    async (event) => {
      const link = getNavigationLink(event);

      if (!link || !isSearchDateEligible()) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const isShown = await showPopup();

      if (!isShown) {
        location.assign(link.href);
      }
    },
    { capture: true, signal: controller.signal },
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
