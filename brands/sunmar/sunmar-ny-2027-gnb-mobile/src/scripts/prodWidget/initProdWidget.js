import {markup} from "../utils/keys.js";
import {waitForElement} from "@utils";

export async function initProdWidget() {
  const containerSelector = '[class*="HeaderMobileMenuList_headerMobileMenuList__"]';
  const prodContainer = await waitForElement(containerSelector);
  if (prodContainer && !prodContainer.dataset.injected) {
    prodContainer.insertAdjacentHTML("afterbegin", markup);
    prodContainer.dataset.injected = 'true';
  }
}
