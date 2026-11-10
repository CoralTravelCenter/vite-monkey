import { initReservationLayout } from "./layoutOptions/reservationLayout.js";

const CLEANUP_WIDGET = Symbol.for("coral-faq-and-button-new-position.cleanup");

export function initWidget() {
  window[CLEANUP_WIDGET]?.();

  const cleanupReservationLayout = initReservationLayout();

  function cleanupWidget() {
    if (window[CLEANUP_WIDGET] !== cleanupWidget) {
      return;
    }

    delete window[CLEANUP_WIDGET];
    cleanupReservationLayout();
  }

  window[CLEANUP_WIDGET] = cleanupWidget;
  return cleanupWidget;
}
