import "./styles/style.scss";
import "./styles/accordeons_styles.css";
import { initWidget } from "./scripts/initWidget.js";
import {hostReactAppReadyAccord} from "./scripts/faqSettings/accordionElement.js";

(async function StartSunmarFaqHotelReservationAdditionalService() {
  const cleanupWidget = initWidget();
  try {
    await hostReactAppReadyAccord();
  }
  catch {}
  if (import.meta.hot) import.meta.hot.dispose(cleanupWidget);
})();
