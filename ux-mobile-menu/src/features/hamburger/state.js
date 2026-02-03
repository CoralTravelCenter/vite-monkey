import {SELECTORS} from "../../constants.js";

export function createHamburgerState(customHamburgerEl) {
    let isOpen = false;
    let headerHamburgerRef = null;

    const getHeaderHamburger = () =>
        document.querySelector(SELECTORS.headerHamburger);

    const syncUi = (open) => {
        isOpen = open;
        customHamburgerEl.classList.toggle("clicked", open);
        document.documentElement.classList.toggle("js-scroll-fix", open);
    };

    const forceClose = () => {
        if (!isOpen) return;

        syncUi(false);
        const btn = headerHamburgerRef || getHeaderHamburger();
        if (btn instanceof HTMLElement) btn.click();
    };

    const toggle = () => {
        const btn = headerHamburgerRef || getHeaderHamburger();
        if (!(btn instanceof HTMLElement)) return; // ещё не отрендерилось

        const nextOpen = !isOpen;
        syncUi(nextOpen);
        btn.click();

        return nextOpen;
    };

    const setHeaderRef = (btn) => {
        headerHamburgerRef = btn || null;
    };

    const reset = () => {
        headerHamburgerRef = null;
        syncUi(false);
    };

    return {
        toggle,
        forceClose,
        syncUi,
        setHeaderRef,
        reset,
        getHeaderHamburger,
    };
}
