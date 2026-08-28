import "./style.scss";
import { initDevWidget } from "./scripts/devWidget/initDevWidget.js";
import { parseHotelWidget } from "./scripts/prodWidget/parseHotelWidget.js";

(async function injectBadgeHotels() {
  try {
    if (import.meta.env.DEV) {
      await initDevWidget();
    } else {
      await parseHotelWidget();
    }
  } catch (error) {
    console.error("Ошибка загрузки бейджа отеля", error);
  }
})();
