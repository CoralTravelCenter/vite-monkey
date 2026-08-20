import {getRandString} from "./randDataGenerator.js";
import {getIdForColor} from "./getIdForColor.js";

export function cardObjectGenerator(id) {
    return {
        card_id: id,
        card_text: getRandString(5),
        card_color: getIdForColor(id),
    }
}