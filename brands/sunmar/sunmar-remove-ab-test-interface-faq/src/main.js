import {waitForElement} from "@utils";
import {deleteMobileSlider} from "../scripts/deleteMobileSlider.js";

;(async function removerFaq() {
  try {
    const container = await waitForElement('[class*="ReservationWidgetV2_reservationWidgetContainer__"]');
    deleteMobileSlider();
  }
  catch {}
})();