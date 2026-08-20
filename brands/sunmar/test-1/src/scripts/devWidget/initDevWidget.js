import {markup} from "../utils/keys.js";
import {waitForElement} from "@utils";
import {initCardList} from "./cardDomElement/injectCardList.js";

export async function initDevWidget() {
    const selector = '#monkey-app';
    const container = await waitForElement(selector);
    if (container && !container.dataset.injected) {
        container.insertAdjacentHTML("afterbegin", markup);
        try {
            await initCardList();
        }
        catch (error) {
            throw new Error("Ошибка инициализации нового компонента", {cause: error});
        }
    }
}