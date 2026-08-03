import { sendMetric } from './metrics.js';
import markup from '../markup.html?raw';

export function createMobileButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'mobile-swap-wrapper';
    wrapper.innerHTML = markup.trim();

    const button = wrapper.querySelector('.swap-button-mobile');
    if (!button) {
        throw new Error('Не удалось создать мобильную кнопку');
    }

    button.addEventListener('click', () => {
        sendMetric('mobile');
    });

    return wrapper;
}
