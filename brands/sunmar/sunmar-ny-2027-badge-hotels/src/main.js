import './style.scss';
import {initDevWidget} from "./scripts/devWidget/initDevWidget.js";
import {parseHotelWidget} from "./scripts/prodWidget/parseHotelWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

;(async function injectBadgeFamilyHotels() {
  try {
    if (import.meta.env.DEV) {
      await initDevWidget();
    }
    else {
      await parseHotelWidget();
    }
  }
  catch (error) {
    outputErrorMessage("Ошибка загрузки главной функции бейджа отеля", error);
  }
})();