import { sendMetric } from './utils/metrics.ts';
import markup from '../markup.html?raw';

export function createMobileWidget() {
    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-swap-wrapper';
    wrapper.innerHTML = markup.trim();

    wrapper.addEventListener('click', () => {
        sendMetric('Mobile');
    });

    return wrapper;
}
