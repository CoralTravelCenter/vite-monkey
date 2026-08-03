import { sendMetric } from './metrics.js';

export function initMobileButton(markup) {
    const logoContainers = document.querySelectorAll('[class*="HeaderMobile_headerLogo"]');

    logoContainers.forEach((logoContainer) => {
        const mobileHeader = logoContainer.closest('[class*="HeaderMobile_header__"]') ?? logoContainer.parentElement;

        if (!mobileHeader || mobileHeader.querySelector('.mobile-swap-wrapper')) {
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-swap-wrapper';
        wrapper.innerHTML = markup.trim();

        const link = wrapper.querySelector('.swap-button');
        link?.addEventListener('click', () => {
            sendMetric('mobile');
        });

        logoContainer.after(wrapper);
    });
}
