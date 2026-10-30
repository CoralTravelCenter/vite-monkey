import { waitForElement } from "@utils";
import { initWidget } from "./initWidget.js";
import { watchSearchForm } from "./search/watchSearchForm.js";
import { SELECTOR } from "./utils/keys.js";

let started = false;

export async function initSearchTrigger() {
  if (started) return;
  started = true;

  const container = await waitForElement(SELECTOR);
  if (!container || container.dataset.popupbfnv2026injected) return;

  function showPopup() {
    setTimeout(() => {
      initWidget(container);
    }, 30000);
  }

  const dispose = watchSearchForm(showPopup);
  if (import.meta.hot) import.meta.hot.dispose(dispose);
}
