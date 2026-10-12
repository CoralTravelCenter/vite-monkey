import {waitForElement} from "@utils";
import {SELECTOR} from "../utils/keys.js";

export async function initWidget(optionBanner) {
    try {
        const devContainer = await waitForElement(SELECTOR);
        if (devContainer && !devContainer.dataset.LoyalMaxxRoyallVoyage) {
            devContainer.insertAdjacentHTML("beforebegin", optionBanner);
            devContainer.dataset.LoyalMaxxRoyallVoyage = "true";
        }
    }
    catch {}
}