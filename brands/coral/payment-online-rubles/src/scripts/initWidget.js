import {waitForElement} from "@utils";
import {MARKUP, SELECTOR_COLUMN} from "./keys.js";

export async function initWidget() {
    try {
        const container = await waitForElement(SELECTOR_COLUMN);
        if (container && !container.dataset.PAYMENTINJECTED) {
            container.insertAdjacentHTML("beforeend", MARKUP);
            container.dataset.PAYMENTINJECTED = "true";
        }
    }
    catch {}
}