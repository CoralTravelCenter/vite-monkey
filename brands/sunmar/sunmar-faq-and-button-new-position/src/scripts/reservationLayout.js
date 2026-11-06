import PLACEHOLDER_MARKUP from "../markup.html?raw";

const SUMMARY_CARD_SELECTOR = '[class*="ProductSummary_productSummaryCard__"]';
const SUBMIT_CONTAINER_SELECTOR = '[data-testid="rsb-container"]';
const INSURANCE_TRACK_SELECTOR = '.glide__track[data-glide-el="track"]';
const INSURANCE_TITLE_SELECTOR = '[class*="InfoCard_title__"]';
const HIDDEN_TRACK_CLASS = "Sunmar-faq-button-position__insurance-hidden";
const MOVED_BUTTON_CLASS = "Sunmar-faq-button-position__submit";
const INSURANCE_TITLES = [
  "Медицинская страховка",
  "Страхование от невыезда",
  "Условия страхования",
];

export function initReservationLayout() {
  const movedButtons = new Map();
  const hiddenTracks = new Set();
  let renderFrame = null;

  function restoreButtons() {
    for (const [buttonContainer, placeholder] of movedButtons) {
      buttonContainer.classList.remove(MOVED_BUTTON_CLASS);
      if (!buttonContainer.isConnected) {
        placeholder.remove();
      } else if (placeholder.isConnected) {
        placeholder.replaceWith(buttonContainer);
      } else {
        buttonContainer.remove();
      }
    }
    movedButtons.clear();
  }

  function moveButtons() {
    for (const [buttonContainer, placeholder] of movedButtons) {
      if (!placeholder.isConnected || !buttonContainer.isConnected) {
        buttonContainer.classList.remove(MOVED_BUTTON_CLASS);
        placeholder.remove();
        buttonContainer.remove();
        movedButtons.delete(buttonContainer);
      }
    }

    const summaryCard = document.querySelector(SUMMARY_CARD_SELECTOR);
    if (!summaryCard) {
      restoreButtons();
      return;
    }

    const buttonContainers = document.querySelectorAll(
      SUBMIT_CONTAINER_SELECTOR,
    );
    let previousElement = summaryCard;

    for (const buttonContainer of buttonContainers) {
      if (!movedButtons.has(buttonContainer)) {
        buttonContainer.insertAdjacentHTML("beforebegin", PLACEHOLDER_MARKUP);
        const placeholder = buttonContainer.previousElementSibling;
        movedButtons.set(buttonContainer, placeholder);
      }

      if (!buttonContainer.classList.contains(MOVED_BUTTON_CLASS)) {
        buttonContainer.classList.add(MOVED_BUTTON_CLASS);
      }

      if (previousElement.nextElementSibling !== buttonContainer) {
        previousElement.after(buttonContainer);
      }
      previousElement = buttonContainer;
    }
  }

  function hideInsuranceTracks() {
    for (const track of hiddenTracks) {
      if (!track.isConnected) {
        track.classList.remove(HIDDEN_TRACK_CLASS);
        hiddenTracks.delete(track);
      }
    }

    for (const track of document.querySelectorAll(INSURANCE_TRACK_SELECTOR)) {
      const titles = Array.from(
        track.querySelectorAll(INSURANCE_TITLE_SELECTOR),
        (title) => title.textContent.trim(),
      );
      const isInsuranceTrack = INSURANCE_TITLES.every((title) =>
        titles.includes(title),
      );

      if (isInsuranceTrack) {
        if (!track.classList.contains(HIDDEN_TRACK_CLASS)) {
          track.classList.add(HIDDEN_TRACK_CLASS);
          hiddenTracks.add(track);
        }
      } else if (hiddenTracks.has(track)) {
        track.classList.remove(HIDDEN_TRACK_CLASS);
        hiddenTracks.delete(track);
      }
    }
  }

  function updateLayout() {
    moveButtons();
    hideInsuranceTracks();
  }

  function scheduleLayout() {
    if (renderFrame !== null) return;

    renderFrame = requestAnimationFrame(() => {
      renderFrame = null;
      updateLayout();
    });
  }

  const observer = new MutationObserver(scheduleLayout);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["class", "data-testid", "data-glide-el"],
  });
  updateLayout();

  return function cleanupReservationLayout() {
    observer.disconnect();
    if (renderFrame !== null) cancelAnimationFrame(renderFrame);
    restoreButtons();
    for (const track of hiddenTracks) {
      track.classList.remove(HIDDEN_TRACK_CLASS);
    }
    hiddenTracks.clear();
  };
}
