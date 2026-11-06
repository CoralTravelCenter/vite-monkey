import "./style.scss";
import { initWidget } from "./scripts/initWidget.js";

(function StartSunmarFaqHotelReservationAdditionalService() {
  const cleanupWidget = initWidget();
  if (import.meta.hot) import.meta.hot.dispose(cleanupWidget);
})();
