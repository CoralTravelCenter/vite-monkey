export function headerChanges() {
    const header = document.querySelector('[data-testid="test-extra-service-widget"]:nth-child(2) [class*="BlockContainer_blockHeader__"]');

    if (!header) {return;}

    const title = header.querySelector('[class*="BlockContainer_title__"]');
    if (!title) {return;}

    title.textContent = "Ответы на популярные вопросы";
}