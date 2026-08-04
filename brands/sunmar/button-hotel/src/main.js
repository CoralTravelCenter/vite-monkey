import './style.css';
import {initDevWidget} from "./scripts/initDevWidget.js";
import {parseHotelWidget} from "./scripts/parseHotelWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function installWidget() {
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