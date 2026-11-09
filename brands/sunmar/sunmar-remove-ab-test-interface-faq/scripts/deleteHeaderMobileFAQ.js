export function deleteHeaderMobileFAQ() {
    const container = document.querySelector('[class*="BlockContainer_title__"]');
    if (!container) {return;}
    if (!container.textContent !== "Ответы на популярные вопросы") {return;}
    const parent = container.parentElement.parentElement.parentElement;
    if (!parent) {return;}
    parent.style.display = "none";
}