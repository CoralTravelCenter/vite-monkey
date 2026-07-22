import { markup } from './includeImages.js';
import { initMobileButton } from './initMobile.js';

function ensureButtonsExist() {
    const desktopHeader = document.querySelector('[class*="HeaderMenuBar_container"] > div');

    if (desktopHeader && !document.querySelector('.desktop-swap-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'desktop-swap-wrapper';
        wrapper.innerHTML = markup;

        const lastChild = desktopHeader.lastElementChild;
        if (lastChild) {
            desktopHeader.insertBefore(wrapper, lastChild);
        } else {
            desktopHeader.appendChild(wrapper);
        }
    }

    initMobileButton(markup);
}

export function initInjector() {
    ensureButtonsExist();
    setInterval(ensureButtonsExist, 1000);
}