import {sendMetric} from "./metric.js";

export async function handleClick(event, selector) {
    try {
        const targetLink = event.target.closest(selector);
        if (targetLink) {
            sendMetric("promo_page");
        }
    } catch (error) {
        throw new Error("Ошибка при нажатии на кнопку", {cause: error});
    }
}