import { waitForElement } from "@utils/dom/mutation.js";
import markup from "./markup.html?raw";
import "./style.scss";
import { getTransfer } from "./getTransfer.js";

const host = await waitForElement(
  'div[class*="ReservationWidgetV2_reservationWidgetContainer__"]',
);

if (!host.querySelector(".promotion-banner")) {
  host.insertAdjacentHTML("beforeend", markup);
}

const transferHost = await waitForElement(
  'div[class*="AddedServiceItem_addedServiceItem__"]',
);
const transferList = transferHost.closest(
  'div[class*="ListAdvanced_listItemsContainer__"]',
);
const transferButton = getTransfer(transferList)?.querySelector(
  ".basic-button-container",
);
const trigger = host.querySelector("[data-trigger-transfer]");

if (trigger && transferButton) {
  trigger.addEventListener("click", () => transferButton.click());
}
