import {getRandString} from "./randDataGenerator.ts";
import {getIdForColor} from "./getIdForColor.ts";
import {cardObject} from "./cardObject.ts";

export function cardObjectGenerator(id: number): cardObject {
    return {
        card_id: id,
        card_text: getRandString(5),
        card_color: getIdForColor(id),
    }
}