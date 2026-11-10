import {
    EXTRA_SERVICE_SELECTOR,
    MARKUP,
    MOVED_BUTTON_CLASS,
    SUBMIT_CONTAINER_SELECTOR,
    SUMMARY_CARD_SELECTOR,
} from "../utils/keys.js";
import { initAccordion } from "../faqSettings/accordionElement.js";

const HIDDEN_BUTTONS_CLASS = "Coral-faq-button-position__original";
const FAQ_CLASS = "Coral-faq-button-position__button-placeholder";

let originalButtons;
let originalMarkup;
let buttonContainer;
let faqBlock;

export function moveButtons() {
    const summaryCard = document.querySelector(SUMMARY_CARD_SELECTOR);
    const submitContainer = document.querySelector(SUBMIT_CONTAINER_SELECTOR);
    const buttons = submitContainer?.querySelector(":scope > .buttons");

    if (!summaryCard || !buttons?.querySelector("button")) {
        restoreButtons();
        return false;
    }

    const extraServiceWidget = submitContainer.parentElement.querySelector(EXTRA_SERVICE_SELECTOR);
    if (extraServiceWidget) {
        if (!faqBlock) {
            submitContainer.insertAdjacentHTML("beforebegin", MARKUP);
            faqBlock = submitContainer.previousElementSibling;
            initAccordion(faqBlock);
        } else if (faqBlock.nextElementSibling !== submitContainer) {
            submitContainer.before(faqBlock);
        }
    } else {
        removeFaq();
    }

    if (!buttonContainer) {
        buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("data-coral-faq-current-buttons", "");
    }

    const containerClasses = submitContainer.className + " Coral-faq-fake-rsb-container " + MOVED_BUTTON_CLASS;
    if (buttonContainer.className !== containerClasses) {
        buttonContainer.className = containerClasses;
    }

    if (buttonContainer.parentElement !== summaryCard) {
        summaryCard.append(buttonContainer);
    }

    const buttonsMarkup = buttons.innerHTML;
    if (originalButtons !== buttons || originalMarkup !== buttonsMarkup) {
        originalButtons?.classList.remove(HIDDEN_BUTTONS_CLASS);
        const copiedButtons = buttons.cloneNode(true);
        copiedButtons.removeAttribute("id");
        copiedButtons.removeAttribute("data-testid");
        for (const element of copiedButtons.querySelectorAll("[id], [data-testid]")) {
            element.removeAttribute("id");
            element.removeAttribute("data-testid");
        }

        const sourceButtons = buttons.querySelectorAll("button");
        const visibleButtons = copiedButtons.querySelectorAll("button");
        visibleButtons.forEach(function(button, index) {
            button.addEventListener("click", function(event) {
                event.stopPropagation();
                const sourceButton = sourceButtons[index];
                if (sourceButton.isConnected && sourceButton.getAttribute("aria-disabled") !== "true") {
                    sourceButton.click();
                }
            });
        });

        buttonContainer.replaceChildren(copiedButtons);
        originalButtons = buttons;
        originalMarkup = buttonsMarkup;
        originalButtons.classList.add(HIDDEN_BUTTONS_CLASS);
    }

    return true;
}

function removeFaq() {
    faqBlock?.remove();
    faqBlock = null;
}

export function restoreButtons() {
    removeFaq();
    originalButtons?.classList.remove(HIDDEN_BUTTONS_CLASS);
    buttonContainer?.remove();
    originalButtons = null;
    originalMarkup = null;
    buttonContainer = null;
}
