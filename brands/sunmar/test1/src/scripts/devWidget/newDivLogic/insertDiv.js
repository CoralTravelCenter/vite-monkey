import {newDivElement} from "../../utils/keys.js";

export function insertDiv(parentdiv, id, text) {
    const testContainer = document.createElement("div");
    testContainer.id = `abobchik${id}`;

    testContainer.insertAdjacentHTML("afterbegin", newDivElement);

    const containerSpan = testContainer.querySelector(".id-element");
    if (containerSpan) {
        containerSpan.textContent = `${id}:`;
    }

    const containerP = testContainer.querySelector(".object-element");
    if (containerP) {
        containerP.textContent = text;
    }

    parentdiv.appendChild(testContainer);

    return testContainer;
}