export function createMainElement(parentElement) {
    if (!parentElement) {
        return null;
    }

    const element = document.createElement("div");
    element.classList.add("abobchik");

    parentElement.appendChild(element);

    return element;
}