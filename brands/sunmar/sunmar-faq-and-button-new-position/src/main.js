import "./styles/style.scss";
import "./styles/accordeons_styles.css";
import { initWidget } from "./scripts/initWidget.js";
import {hostReactAppReadyAccord} from "./scripts/faqSettings/accordionElement.js";
import {headerChanges} from "./scripts/headerChanges.js";

(async function StartSunmarFaqHotelReservationAdditionalService() {
  ym(215233,'reachGoal','faq_add_passenger_group_B');
  const cleanupWidget = initWidget();

  try {
    await hostReactAppReadyAccord();
  }
  catch {}

  headerChanges();

  if (import.meta.hot) import.meta.hot.dispose(cleanupWidget);
})();
