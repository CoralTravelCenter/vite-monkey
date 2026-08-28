import {QUANTITY_ELEMENTS} from "./QUANTITY_CARDS.js";
import {cardObjectGenerator} from "./cardObjectGenerator.js";

export const CARDS_LIST = QUANTITY_ELEMENTS.map(element => {
    return cardObjectGenerator(element);
})