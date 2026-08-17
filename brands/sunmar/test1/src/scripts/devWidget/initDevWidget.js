import {markup} from "../utils/keys.js";
import {waitForElement} from "@utils";
import {newDiv} from "./newDivLogic/createComponent.js";

export async function initDevWidget() {
    const selector = '#monkey-app';
    const container = await waitForElement(selector);
    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML("afterbegin", markup);
        try {
            await newDiv();
        }
        catch (error) {
            throw new Error("Ошибка инициализации нового компонента", {cause: error});
        }
    }
}