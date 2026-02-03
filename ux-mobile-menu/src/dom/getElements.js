import {SELECTORS} from "../constants.js";

export function getElements() {
    const customMenu = document.querySelector(SELECTORS.rootId);

    return {
        customMenu,
        customPromoLink: document.querySelector(SELECTORS.promo),
        customChatLink: document.querySelector(SELECTORS.chat),
        customHamburger: document.querySelector(SELECTORS.burger),
        customLogin: document.querySelector(SELECTORS.user),
    };
}
