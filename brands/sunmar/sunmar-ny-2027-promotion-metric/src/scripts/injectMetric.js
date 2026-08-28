import {waitForElement} from "@utils";

export async function injectMetric(){
    const selector = 'li.promo-card.sunmar a.promo-card__link[href*="puteshestvie-novyi-god"]';
    const metric = "if(typeof window.ym === 'function'){ym(215233, 'reachGoal', 'entry_point', {name_stock: {NY_26_27: {name_point: 'promo_page',},},});}";
    try {
        const container = await waitForElement(selector);
        if (container) {
            container.setAttribute("onclick", metric);
        }
    }
    catch(error) {
        throw new Error("Не удалось найти баннер NY-2027: ", {
            cause: error,
        });
    }
}