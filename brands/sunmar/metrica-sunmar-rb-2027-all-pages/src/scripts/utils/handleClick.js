import {sendMetric} from "./metric.js";

export async function handleClick(wrapperElement) {
    try {
        const buttonBanner = wrapperElement.querySelector("#banner-button-metric");
        if (!buttonBanner) { return; }
        buttonBanner.addEventListener("click", () => {
            sendMetric();
        });
    } catch (error) {
        throw new Error("Ошибка при нажатии на кнопку", {cause: error});
    }
}