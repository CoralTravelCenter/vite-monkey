import "./styles/global.scss";
import "./styles/max_royale_banner.scss";
import "./styles/voyage_banner.scss";
import {parseHotelWidget} from "./scripts/initWidget/parseHotelWidget.js";

;(async function injectLoyalMaxxRoyallVoyage() {
  try {
    await parseHotelWidget();
  }
  catch {}
})();