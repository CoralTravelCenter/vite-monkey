export function initMobileButton(markup) {
    const logoContainer = document.querySelector('[class*="HeaderMobile_headerLogo"]');

    if (logoContainer && !document.querySelector('.mobile-swap-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mobile-swap-wrapper';
        wrapper.innerHTML = markup;

        logoContainer.after(wrapper);
    }
}