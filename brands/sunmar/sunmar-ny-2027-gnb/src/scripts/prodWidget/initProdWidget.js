import {markup} from "../utils/keys.js";
import {sendMetric} from "../utils/send_metric.js";
import {openLink} from "../utils/openLink.js";

export function initProdWidget() {
    const selector = '[class*=BasicMenu_menuContainer__]';
    const prodContainer = document.querySelector(selector);

    if (prodContainer && !prodContainer.querySelector(".sunmar-ny-2027-gnb")) {
        prodContainer.insertAdjacentHTML("afterbegin", markup);

        const sendMetricButton = prodContainer.querySelector("#sunmar-ny-2027-gnb__button");
        if (sendMetricButton) {
            const href = sendMetricButton.getAttribute("data-href");
            sendMetricButton.addEventListener("click", () => {
                sendMetric();
                openLink(href);
            })
        }
    }
}
