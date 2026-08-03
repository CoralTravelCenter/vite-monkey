import {waitForElement} from "@utils";

export async function initDevWidget() {
    const element = 'monkey-app';
    try {
        const selector = await waitForElement(element);
        const devContainer = document.getElementById(selector);
        if (devContainer && !devContainer.dataset.injected) {
            devContainer.innerHTML = markup;
            devContainer.dataset.injected = 'true';
        }
    }
    catch (error) {
        console.error(`Не удалось получить элемент: ${error}`);
    }
}