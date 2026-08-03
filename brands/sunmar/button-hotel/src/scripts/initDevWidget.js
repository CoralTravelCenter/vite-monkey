import {awaitDomElement} from "@utils";

export async function initDevWidget() {
    const idApp = 'monkey-app';
    const selector = await awaitDomElement(idApp);
    const devContainer = document.getElementById(selector);
    if (devContainer && !devContainer.dataset.injected) {
        devContainer.innerHTML = markup;
        devContainer.dataset.injected = 'true';
    }
}