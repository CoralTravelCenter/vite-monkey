import { markup } from "./scripts/includeImages.js";
import './style.css';

async function initWidget() {
    if (typeof hostReactAppReady === 'function') {
        await hostReactAppReady();
        const devContainer = document.getElementById('monkey-app');

        if (devContainer && !devContainer.dataset.injected) {
            devContainer.innerHTML = markup;
            devContainer.dataset.injected = 'true';
        }
        return;
    }

    const prodContainer = document.getElementById('widget-maldives-cards');

    if (prodContainer && !prodContainer.dataset.injected) {
        prodContainer.innerHTML = markup;
        prodContainer.dataset.injected = 'true';
    }
}

initWidget();