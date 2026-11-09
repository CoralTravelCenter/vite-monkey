import { moveButtons, restoreButtons } from "./buttonManager.js";
import { hideInsuranceTracks, restoreInsuranceTracks } from "./insuranceManager.js";

export function initReservationLayout() {
  let renderFrame = null;

  function updateLayout() {
    moveButtons();
    hideInsuranceTracks();
  }

  function scheduleLayout() {
    if (renderFrame !== null) {
      return;
    }

    renderFrame = requestAnimationFrame(function() {
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

    if (renderFrame !== null) {
      cancelAnimationFrame(renderFrame);
    }

    restoreButtons();
    restoreInsuranceTracks();
  };
}