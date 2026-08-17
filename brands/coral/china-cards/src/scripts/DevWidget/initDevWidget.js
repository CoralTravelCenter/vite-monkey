import {waitForElement} from "@utils";
import {markup} from "../utils/keys.js";

export async function initDevWidget() {
    const selector = "#monkey-app";
    try {
        const devContainer = await waitForElement(selector);
        if (devContainer && !devContainer.dataset.injected) {
            devContainer.insertAdjacentHTML("afterbegin", markup);
            devContainer.dataset.injected = 'true';
        }
    }
    catch (error) {
        throw new Error("Ошибка инициализации dev-виджета" + {cause: error});
    }
}