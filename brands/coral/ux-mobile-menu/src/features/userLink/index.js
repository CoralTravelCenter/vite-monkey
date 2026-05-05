import {createAvatarState} from "./avatarState.js";
import {observeLoginButton} from "./observeLoginButton.js";
import {observeAccountMenu} from "./observeAccountMenu.js";
import {trackMobileMenu} from "../metrics/mobileMenuMetrics.js";

export function setupUserLink(customLoginEl) {
    if (!customLoginEl) return;

    const {showAuthorized, showUnauthorized, removeCloned} =
        createAvatarState(customLoginEl);

    const trackAccount = () => trackMobileMenu("account");

    const disposeLoginBtn = observeLoginButton(customLoginEl, {
        onTrack: trackAccount,
    });

    const disposeAccountMenu = observeAccountMenu(customLoginEl, {
        showAuthorized,
        showUnauthorized,
        onTrack: trackAccount,
    });

    return () => {
        customLoginEl.onclick = null;
        removeCloned();

        disposeLoginBtn?.();
        disposeAccountMenu?.();

        showUnauthorized();
    };
}
