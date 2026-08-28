import {markup} from "../utils/keys.js";

export function initProdWidget() {
  const selector = '[class*=BasicMenu_menuContainer__]';
  const prodContainer = document.querySelector(selector);

  if (prodContainer && !prodContainer.querySelector(".sunmar-ny-2027-gnb")) {
    prodContainer.insertAdjacentHTML("afterbegin", markup);
  }
}
