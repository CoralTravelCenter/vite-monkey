import {waitForElement} from "@utils";

export async function initWidget() {
    const selector = 'li.promo-card.sunmar[data-filter*="Акции отелей"] a.promo-card__link[href*="/rb-2026-2027/"]';
    const metric = "ym(215233, 'reachGoal', 'entry_point', {name_stock: {eb_winter_27: {name_point: 'promo_page',},},});";
    try {
        const container = await waitForElement(selector);
        if (container) {
            container.setAttribute("onclick", metric);
        }
    }
    catch(error) {
        throw new Error("Ошибка инъекции события метрики");
    }
}