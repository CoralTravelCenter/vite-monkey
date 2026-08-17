import markup from "../../markup.html?raw";

export function initProdWidget() {
    const prodContainer = document.getElementById("widget-maldives-cards");
    if (prodContainer && !prodContainer.dataset.injected) {
        prodContainer.insertAdjacentHTML("afterbegin", markup);
        prodContainer.dataset.injected = 'true';
    }
}