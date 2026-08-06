import markup from "../../markup.html?raw";
import {waitForElement} from "@utils";

export async function initDevWidget() {
    const selector = '#monkey-app';
    const container = await waitForElement(selector);
    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML("afterbegin", markup);
    }
}