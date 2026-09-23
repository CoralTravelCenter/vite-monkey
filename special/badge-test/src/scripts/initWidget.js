import {waitForElement} from "@utils";
import {MARKUP, SELECTOR, SELECTOR2} from "./keys.js";

export async function initWidget() {
    try {
        const container = await waitForElement(SELECTOR);
        if (container && !container.querySelector(SELECTOR2)) {
            container.insertAdjacentHTML("afterbegin", MARKUP);
        }
    } catch {}
}