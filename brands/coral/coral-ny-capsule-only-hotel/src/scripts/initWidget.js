import { waitForElement } from "../../../../../utils/index.js";
import {
  BUTTON_CONTAINER,
  CONTAINER_CAPSULE,
  MARKUP,
  SELECTOR,
} from "./utils/keys.ts";
import { metric } from "./utils/metric.js";

export async function initWidget() {
  try {
    const container = await waitForElement(SELECTOR);
    const existingPopup = container.querySelector(CONTAINER_CAPSULE);

    if (existingPopup) {
      return existingPopup;
    }

    await customElements.whenDefined("coral-popup");

    container.insertAdjacentHTML("afterbegin", MARKUP);

    const popup = container.querySelector(CONTAINER_CAPSULE);
    const action = popup?.querySelector(BUTTON_CONTAINER);

    if (action) {
      action.addEventListener("click", metric);
    }

    popup?.show?.();

    return popup;
  } catch {}

  return null;
}
