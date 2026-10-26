import { sendEntryPoint } from "../metric/sendEntryPoint.js";

export function bindPopupEvents(dialog) {
  const previousFocus = document.activeElement;
  const events = new AbortController();

  function closePopup() {
    dialog.close();
  }

  function cleanupPopup() {
    events.abort();
    dialog.remove();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  dialog.addEventListener("close", cleanupPopup, { once: true });
  dialog
    .querySelector(".popup-bf2026-close")
    .addEventListener("click", closePopup, { signal: events.signal });
  dialog
    .querySelector(".popup-bf2026-link")
    .addEventListener("click", sendEntryPoint, { signal: events.signal });
}
