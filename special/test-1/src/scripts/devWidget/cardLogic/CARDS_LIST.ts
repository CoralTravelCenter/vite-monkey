import {QUANTITY_ELEMENTS} from "./QUANTITY_CARDS.js";
import {cardObjectGenerator} from "./cardObjectGenerator.js";
import {cardObject} from "./cardObject.ts";

export const CARDS_LIST: cardObject[] = QUANTITY_ELEMENTS.map(element => {
    return cardObjectGenerator(element);
})