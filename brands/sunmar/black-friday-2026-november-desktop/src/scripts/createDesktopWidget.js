import {sendMetric} from "./utils/metrics.ts";
import {MARKUP} from "./utils/keys.js";

export function createDesktopWidget() {
    const wrapper = document.createElement('div');
    wrapper.className = 'desktop-swap-wrapper';
    wrapper.innerHTML = MARKUP.trim();

    wrapper.addEventListener('click', () => {
        sendMetric('PC');
    });

    return wrapper;
}
