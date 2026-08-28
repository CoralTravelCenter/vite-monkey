import {waitForElement} from "@utils";
import {markup} from "./keys.js";
import {outputWidget} from "./outputWidget.js";

export async function injectWidget() {
    const selector = "#monkey-app";
    const prodWidget = await waitForElement(selector);
    if (prodWidget && !prodWidget.dataset.test_2Injected) {
        prodWidget.insertAdjacentHTML("afterbegin", markup);
        prodWidget.dataset.test_2Injected = "true";
        const selectorWidget = ".test-2";
        const selectedWidget = prodWidget.querySelector(selectorWidget);
        if (selectedWidget) {
            outputWidget(selectedWidget);
        }
    }
}