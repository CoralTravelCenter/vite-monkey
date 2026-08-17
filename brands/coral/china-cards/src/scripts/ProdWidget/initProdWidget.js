import {markup} from "../utils/keys.js";

export function initProdWidget() {
    const container = document.getElementById('widget-china-cards');
    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML('afterbegin', markup);
        container.dataset.injected = 'true';
    }
}