import {waitForElement} from "@utils";
import markup from "../markup.html?raw";

export async function initDevWidget() {
    try {
        const element = '#monkey-app';
        const devContainer = await waitForElement(element);
        if (devContainer && !devContainer.dataset.injected) {
            devContainer.insertAdjacentHTML('afterbegin', markup);
            devContainer.dataset.injected = 'true';
        }
    } catch(error) {
        throw new Error("Ошибка инициализации dev-widget", {cause: error});
    }
}