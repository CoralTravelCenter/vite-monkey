import {dataNew} from "./data.js";
import {insertDiv} from "./insertDiv.js";
import {paintDiv} from "./paintDiv.js";

function getRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

export function moreElements(parentdiv) {
    const doneElements = dataNew.map(element => {
        return {
            createElementDiv: insertDiv(parentdiv, element, getRandomString(5)),
            elementId: element,
        };
    });

    doneElements.forEach(element => {paintDiv(element)});
    return doneElements;
}