import {waitForElement} from "@utils";
import {MARKUP, SELECTOR} from "./keys.js";

export async function initWidget() {
    try {
        const container = await waitForElement(SELECTOR);
        if (container && !container.dataset.CfcCoralButtons) {
            container.insertAdjacentHTML("afterbegin", MARKUP);
            container.dataset.CfcCoralButtons = "true";
        }
    }
    catch {}
}