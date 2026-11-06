import { initReservationLayout } from "./reservationLayout.js";

let cleanupWidget = null;

export function initWidget() {
  if (cleanupWidget) cleanupWidget();

  const cleanupReservationLayout = initReservationLayout();

  cleanupWidget = () => {
    cleanupReservationLayout();
    cleanupWidget = null;
  };

  return cleanupWidget;
}
