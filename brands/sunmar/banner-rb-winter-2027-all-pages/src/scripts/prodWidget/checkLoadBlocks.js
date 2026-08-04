import {waitForElement} from "@utils";

export async function checkLoadBlocks() {
    try {
        const selector = "[data-v-app], .hot-deals-block, #seo-block-place";
        await waitForElement(selector);
    } catch (error) {
        throw new Error("Не найдены блоки для внедрения баннер", {cause: error});
    }
}