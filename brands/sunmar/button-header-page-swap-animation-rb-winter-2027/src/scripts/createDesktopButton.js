import {sendMetric} from "./metrics.js";
import markup from "../markup.html?raw";

export function createDesktopButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'desktop-swap-wrapper';
    wrapper.innerHTML = markup.trim();

    const link = wrapper.querySelector('.button-header-page-swap-animation-rb-winter-2027');
    link?.addEventListener('click', () => {
        sendMetric('PC');
    });

    return wrapper;
}
