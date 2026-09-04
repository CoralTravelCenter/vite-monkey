import {waitForElement} from "@utils";
import {MARKUP} from "./keys.js";

export async function initWidget() {
    const selector = "#monkey-app";
    try {
        const container = await waitForElement(selector);
        if (container && !container.dataset.CfcCoralButtons) {
            container.insertAdjacentHTML("afterbegin", MARKUP);
            container.dataset.CfcCoralButtons = "true";
        }
    }
    catch {}
}