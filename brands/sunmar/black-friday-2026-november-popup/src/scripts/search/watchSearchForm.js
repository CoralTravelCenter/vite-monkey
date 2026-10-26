import { getSearchType } from "./searchConditions.js";
import { hasMatchingSearchDates } from "./hasMatchingSearchDates.js";

export function watchSearchForm(
  onMatch,
  pageWindow = window,
  pageDocument = document,
) {
  let pollTimer;
  let stopped = false;

  function dispose() {
    stopped = true;
    pageWindow.clearInterval(pollTimer);
    pageWindow.removeEventListener("pagehide", onPageHide);
  }

  function onPageHide(event) {
    if (!event.persisted) dispose();
  }

  function check() {
    if (stopped) return;

    const type = getSearchType(new URL(pageWindow.location.href));
    if (!type || !hasMatchingSearchDates(pageDocument, type)) return;

    dispose();
    onMatch();
  }

  pageWindow.addEventListener("pagehide", onPageHide);
  pollTimer = pageWindow.setInterval(check, 500);
  check();

  return dispose;
}
