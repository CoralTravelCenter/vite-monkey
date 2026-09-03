import "./style.scss";
import {parseHotelWidget} from "./scripts/initWidget/parseHotelWidget.js";
;(async function injectCoralShildRak() {
  try {
    await parseHotelWidget();
  }
  catch {}
})();