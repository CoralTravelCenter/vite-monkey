import {markup} from "../utils/keys.js";

export function initProdWidget() {
    const selector = '[data-jet-insert]';
// eslint-disable-next-line no-undef
    const container = document.querySelector(selector);

    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML('afterbegin', markup);
        container.dataset.injected = 'true';
    }
}