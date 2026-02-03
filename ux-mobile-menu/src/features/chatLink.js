import {debounce, getMobileOS} from "../../../utils.js";
import {CLICK_DEBOUNCE, IMESSAGE_LINK} from "../constants.js";
import {trackMobileMenu} from "./metrics/mobileMenuMetrics.js";

export function setupChatLink(link) {
    if (!link) return;

    const os = getMobileOS();
    let handler;

    if (os === "iOS") {
        handler = () => {
            trackMobileMenu("jivo");
            window.location.href = IMESSAGE_LINK;
        };
        link.addEventListener("click", handler);
        return () => link.removeEventListener("click", handler);
    }

    if (os === "android") {
        handler = debounce(() => {
            trackMobileMenu("jivo");
            window.jivo_api?.open?.({start: "menu"});
        }, CLICK_DEBOUNCE);

        link.addEventListener("click", handler);
        return () => link.removeEventListener("click", handler);
    }
}
