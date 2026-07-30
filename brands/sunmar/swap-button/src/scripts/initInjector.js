import markup from '../markup.html?raw';
import { sendMetric } from './metrics.js';

function ensureButtonsExist() {
    const desktopHeader = document.querySelector('[class*="HeaderMenuBar_container"] > div');

    if (desktopHeader && !document.querySelector('.desktop-swap-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'desktop-swap-wrapper';
        wrapper.innerHTML = markup;

        const link = wrapper.querySelector('.swap-button');
        if (link && !link.dataset.goalBound) {
            link.dataset.goalBound = 'true';
            link.addEventListener('click', () => {
                sendMetric('PC');
            });
        }

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

export function initMobileButton(markup) {
    const logoContainer = document.querySelector('[class*="HeaderMobile_headerLogo"]');

    if (logoContainer && !document.querySelector('.mobile-swap-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-swap-wrapper';
        wrapper.innerHTML = markup;

        const link = wrapper.querySelector('.swap-button');
        if (link && !link.dataset.goalBound) {
            link.dataset.goalBound = 'true';
            link.addEventListener('click', () => {
                sendMetric('mobile');
            });
        }

        logoContainer.after(wrapper);
    }
}

export function initSwapAnimation() {
    setInterval(() => {
        const swapButtons = document.querySelectorAll('.swap-button');

        if (swapButtons.length > 0) {
            swapButtons.forEach((button) => {
                button.classList.toggle('is-swapped');
            });
        }
    }, 2000);
}