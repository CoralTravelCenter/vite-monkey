import { markup } from "./scripts/includeImages.js";
import './style.css';

if (import.meta.env.DEV) {
    async function initWidget() {
        if (typeof hostReactAppReady === 'function') {
            await hostReactAppReady();
            const devContainer = document.getElementById('monkey-app');

            if (devContainer && !devContainer.dataset.injected) {
                devContainer.innerHTML = markup;
                devContainer.dataset.injected = 'true';
                return;
            }
            console.error('Failed to load monkey-app');
        }
    }

    initWidget();
}

function onProdContainer() {
    const prodContainer = document.getElementById('widget-maldives-cards');

    if (prodContainer && !prodContainer.dataset.injected) {
        prodContainer.innerHTML = markup;
        prodContainer.dataset.injected = 'true';
    }
}

if (!import.meta.env.DEV) {
    onProdContainer();
}