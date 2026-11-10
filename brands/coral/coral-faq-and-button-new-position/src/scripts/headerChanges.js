const FAQ_TITLE = "Ответы на популярные вопросы";

let currentTitle;
let originalText;

export function headerChanges(extraServiceWidget) {
    const title = extraServiceWidget.matches(":nth-child(2)")
        ? extraServiceWidget.querySelector('[class*="BlockContainer_blockHeader__"] [class*="BlockContainer_title__"]')
        : null;

    if (currentTitle !== title) {
        restoreHeader();
    }

    if (title && title.textContent !== FAQ_TITLE) {
        currentTitle = title;
        originalText = title.textContent;
        title.textContent = FAQ_TITLE;
    }
}

export function restoreHeader() {
    if (currentTitle?.textContent === FAQ_TITLE) {
        currentTitle.textContent = originalText;
    }

    currentTitle = null;
    originalText = null;
}
