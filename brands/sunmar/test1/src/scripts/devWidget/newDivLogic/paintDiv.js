export function paintDiv(item) {
    const card = item.createElementDiv.querySelector(".new-div-element");
    const targetElement = card || item.createElementDiv;

    if (item.elementId % 3 === 0) {
        targetElement.classList.add("gradient-two");
    }
    else if (item.elementId % 5 === 0) {
        targetElement.classList.add("gradient-three");
    }
    else {
        targetElement.classList.add("gradient-one");
    }
}