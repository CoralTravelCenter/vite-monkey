import markup from '../markup.html?raw';
import { initMobileButton } from './initMobile.js';
import { sendMetric } from './metrics.js';

let injectorObserver = null;

function createDesktopButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'desktop-swap-wrapper';
    wrapper.innerHTML = markup.trim();

    const link = wrapper.querySelector('.swap-button');
    link?.addEventListener('click', () => {
        sendMetric('PC');
    });

    return wrapper;
}

function ensureButtonsExist() {
    const desktopHeader = document.querySelector(
        '[class*="HeaderMenuBar_container"] > div',
    );

    const desktopButtonExists = desktopHeader
        ? Array.from(desktopHeader.children).some((element) =>
            element.classList.contains('desktop-swap-wrapper'),
        )
        : false;

    if (desktopHeader && !desktopButtonExists) {
        const wrapper = createDesktopButton();
        const lastChild = desktopHeader.lastElementChild;

        if (lastChild) {
            desktopHeader.insertBefore(wrapper, lastChild);
        } else {
            desktopHeader.appendChild(wrapper);
        }
    }

    initMobileButton(markup);
}

function safelyEnsureButtonsExist() {
    try {
        ensureButtonsExist();
    } catch (error) {
        console.error('Ошибка внедрения блока:', error);
    }
}

export function initInjector() {
    if (injectorObserver !== null) {
        return;
    }

    safelyEnsureButtonsExist();

    try {
        const observer = new MutationObserver(() => {
            safelyEnsureButtonsExist();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        injectorObserver = observer;
    } catch (error) {
        console.error('Ошибка запуска MutationObserver:', error);
    }
}