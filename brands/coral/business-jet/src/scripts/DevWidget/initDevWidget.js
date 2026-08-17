import {markup} from "../utils/keys.js";
import {waitForElement} from "@utils";

export async function initDevWidget() {
    const selector = "#monkey-app";
    try {
        const devContainer = await waitForElement(selector);
        if(devContainer && !devContainer.dataset.injected) {
            devContainer.insertAdjacentHTML("beforebegin", markup);
            devContainer.dataset.injected = "true";
        }
    }
    catch(error) {
        throw new Error("Ошибка инициализации dev-виджета: " + {cause: error});
    }
}