import markup from '../../markup.html?raw';
import { waitForElement } from '@utils';

export async function initProdWidget() {
    const selector = '[data-jet-insert]';
    const container = await waitForElement(selector);

    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML('afterbegin', markup);
        container.dataset.injected = 'true';
    }
}