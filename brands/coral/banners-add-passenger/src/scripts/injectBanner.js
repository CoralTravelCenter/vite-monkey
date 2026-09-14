import {BANNER_SELECTOR, MARKUP} from "./keys.ts";
import {hostElement} from "./hostElement.js";

export function injectBanner() {
    if (!hostElement.querySelector(BANNER_SELECTOR)) {
        hostElement.insertAdjacentHTML("beforeend", MARKUP);
    }
}