import markup from "../../markup.html?raw";
import {waitForElement} from "@utils";
import {handleClick} from "../utils/handleClick.js";

export async function initDevWidget() {
    try {
        const element = '#monkey-app';
        const devContainer = await waitForElement(element);
        if (devContainer && !devContainer.dataset.injected) {
            devContainer.insertAdjacentHTML("afterbegin", markup);
            devContainer.dataset.injected = 'true';
            await handleClick(devContainer);
        }
    } catch(error) {
        throw new Error("Ошибка инициализации dev-widget", {cause: error});
    }
}