import {ReactDomObserver} from "../../../../utils.js";
import {SELECTORS} from "../../constants.js";

export function observeLoginButton(customLoginEl, {onTrack}) {
    if (!customLoginEl) return;

    const obs = new ReactDomObserver(SELECTORS.loginButton, {
        onAppear: (loginButton) => {
            if (!loginButton) return;
            customLoginEl.onclick = () => {
                onTrack?.()
                loginButton.click()
            };
        },
    });

    obs.start();

    return () => obs.stop?.();
}
