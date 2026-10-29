import { MARKUP } from "./utils/keys.js";
import { bindPopupEvents } from "./popup/bindPopupEvents.js";

export function initWidget(container) {
  if (!container || container.dataset.popupbfnv2026injected) return;

  container.insertAdjacentHTML("beforeend", MARKUP);
  container.dataset.popupbfnv2026injected = "true";
  const dialog = container.querySelector(".popup-bf2026-dialog");
  bindPopupEvents(dialog);
  dialog.showModal();
}
