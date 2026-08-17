import markup from "../../markup.html?raw";
import {waitForElement} from "@utils";

export async function initDevWidget() {
    try {
        const selector = "#monkey-app"
        const devContainer = await waitForElement(selector);
        if (devContainer && !devContainer.dataset.injected) {
            devContainer.insertAdjacentHTML("afterbegin", markup);
            devContainer.dataset.injected = 'true';
        }
    }
    catch (error) {
        throw new Error("Ошибка инициализации dev-контейнера: " + {cause: error});
    }
}