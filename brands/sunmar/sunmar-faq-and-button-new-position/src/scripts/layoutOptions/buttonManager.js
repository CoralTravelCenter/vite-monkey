import {
    MARKUP,
    MOVED_BUTTON_CLASS,
    SUBMIT_CONTAINER_SELECTOR,
    SUMMARY_CARD_SELECTOR
} from "../utils/keys.js";

export function moveButtons() {
    const summaryCard = document.querySelector(SUMMARY_CARD_SELECTOR);
    const rsbContainer = document.querySelector(SUBMIT_CONTAINER_SELECTOR + ':not(.Sunmar-faq-fake-rsb-container)');

    if (!summaryCard || !rsbContainer) {
        return;
    }

    const isStepOne = document.querySelector('[data-testid="test-extra-service-widget"]') !== null;
    let faqBlock = document.querySelector('.Sunmar-faq-button-position__button-placeholder');

    if (isStepOne) {
        if (!faqBlock) {
            rsbContainer.insertAdjacentHTML("beforebegin", MARKUP);
            faqBlock = rsbContainer.previousElementSibling;
        } else if (faqBlock.nextElementSibling !== rsbContainer) {
            rsbContainer.before(faqBlock);
        }
    } else {
        if (faqBlock) {
            faqBlock.remove();
            faqBlock = null;
        }
    }

    const buttonsBlock = document.querySelector('.buttons');
    if (!buttonsBlock) {
        return;
    }

    let fakeContainer = document.querySelector('.Sunmar-faq-fake-rsb-container');
    if (!fakeContainer) {
        fakeContainer = document.createElement('div');
        fakeContainer.setAttribute('data-testid', 'rsb-container');
        fakeContainer.className = rsbContainer.className;
        fakeContainer.classList.add('Sunmar-faq-fake-rsb-container');
        fakeContainer.classList.add(MOVED_BUTTON_CLASS);
    }

    rsbContainer.classList.remove(MOVED_BUTTON_CLASS);

    if (fakeContainer.parentElement !== summaryCard) {
        summaryCard.appendChild(fakeContainer);
    }

    if (buttonsBlock.parentElement !== fakeContainer) {
        fakeContainer.appendChild(buttonsBlock);
    }
}

export function restoreButtons() {
    const faqBlock = document.querySelector('.Sunmar-faq-button-position__button-placeholder');
    if (faqBlock) {
        faqBlock.remove();
    }

    const fakeContainer = document.querySelector('.Sunmar-faq-fake-rsb-container');
    const rsbContainer = document.querySelector(SUBMIT_CONTAINER_SELECTOR + ':not(.Sunmar-faq-fake-rsb-container)');

    if (fakeContainer && rsbContainer) {
        const buttonsBlock = fakeContainer.querySelector('.buttons');
        if (buttonsBlock) {
            rsbContainer.appendChild(buttonsBlock);
        }
        fakeContainer.remove();
    }
}