import {createMainElement} from "./createMainElement.js";
import {parseCards} from "./parseCards.js";

export function injectMainElement(parentElement) {
    const element = createMainElement(parentElement);
    if (element) {
        const cards = parseCards(element);
        if (cards) {
            element.appendChild(cards);
            return element;
        }
    }
}