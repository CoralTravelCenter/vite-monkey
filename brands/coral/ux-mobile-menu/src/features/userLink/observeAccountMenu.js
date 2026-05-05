import {ReactDomObserver} from "../../../../utils.js";
import {SELECTORS} from "../../constants.js";

export function observeAccountMenu(customLoginEl, {showAuthorized, showUnauthorized, onTrack} = {}) {
    if (!customLoginEl) return;

    const obs = new ReactDomObserver(SELECTORS.accountMenu, {
        onAppear: (menu) => {
            if (!menu) return;

            const avatar = menu.querySelector(".ant-avatar");
            const first = avatar?.firstElementChild;
            if (first) first.style.opacity = "1";

            showAuthorized?.(avatar);

            customLoginEl.onclick = () => {
                onTrack?.();
                const trigger = menu.firstChild;
                if (trigger instanceof HTMLElement) trigger.click();
            };
        },

        onDisappear: () => {
            showUnauthorized?.();
        },
    });

    obs.start();

    return () => obs.stop?.();
}
