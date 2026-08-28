import {CARDS_LIST} from "../cardLogic/CARDS_LIST.js";
import {cardDom} from "./cardDom.js";

export function parseCards(parentElement) {
    return CARDS_LIST.map(card => {
        return cardDom(parentElement, card);
    });
}