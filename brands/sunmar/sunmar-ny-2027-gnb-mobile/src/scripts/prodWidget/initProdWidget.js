import {markup} from "../utils/keys.js";
import {waitForElement} from "@utils";

export async function initProdWidget() {
  const containerSelector = '[class*="HeaderMobileMenuList_headerMobileMenuList__"]';
  try {
    const prodContainer = await waitForElement(containerSelector);
    if (prodContainer && !prodContainer.dataset.sunmarNy2027GnbMobileInjected) {
      prodContainer.insertAdjacentHTML("afterbegin", markup);
      prodContainer.dataset.sunmarNy2027GnbMobileInjected = 'true';
    }
  }
  catch (error) {
    throw new Error("Не удалось найти контейнер или вставить виджет", {
      cause: error,
    });
  }
}
