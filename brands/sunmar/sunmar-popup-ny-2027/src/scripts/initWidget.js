import {markup} from "./utils/keys.js";
import {waitForElement} from "@utils";

export async function initWidget() {
    const selector = "#monkey-app";
    const container = await waitForElement(selector);
    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML("afterbegin", markup);
        container.dataset.injected = "true";
    }
}