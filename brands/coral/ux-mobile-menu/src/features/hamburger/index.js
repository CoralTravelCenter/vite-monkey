import {createHamburgerState} from "./state.js";
import {observeHeaderHamburgerButton} from "./observeHeaderButton.js";
import {trackMobileMenu} from "../metrics/mobileMenuMetrics.js";

export function setupHamburger(customHamburgerEl, {onRoute} = {}) {
    if (!customHamburgerEl) return;

    const state = createHamburgerState(customHamburgerEl);

    const onClick = () => {
        const opened = state.toggle();

        // ✅ метрика только при открытии
        if (opened === true) {
            trackMobileMenu("menu");
        }
    };
    customHamburgerEl.addEventListener("click", onClick);

    const stopObserver = observeHeaderHamburgerButton({
        onAppear: (btn) => state.setHeaderRef(btn),
        onDisappear: () => state.reset(),
    });

    // ✅ прямо тут подписываемся (как ты делал)
    const unsub = window.CoralRouteBus?.subscribe?.(() => {
        state.forceClose();
        onRoute?.();
        state.setHeaderRef(state.getHeaderHamburger());
    });

    return () => {
        customHamburgerEl.removeEventListener("click", onClick);
        stopObserver?.();
        if (typeof unsub === "function") unsub();
        state.syncUi(false);
    };
}
