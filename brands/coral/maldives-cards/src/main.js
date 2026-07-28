import { markup } from "./scripts/includeImages.js";
import './style.css';

function injectMarkup(containerId) {
    const container = document.getElementById(containerId);
    if (container && !container.dataset.injected) {
        container.innerHTML = markup;
        container.dataset.injected = 'true';
    }
}

function initWidget() {
    if (typeof hostReactAppReady === 'function') {
        hostReactAppReady()
            .then(() => {
                injectMarkup('monkey-app');
            })
            .catch((err) => {
                console.error(err);
            });
        return;
    }

    injectMarkup('widget-maldives-cards');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
} else {
    initWidget();
}