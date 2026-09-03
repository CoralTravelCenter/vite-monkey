import "./style.scss";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {parseHotelWidget} from "./scripts/initWidget/parseHotelWidget.js";
;(async function injectCoralShildRak() {
  try {
    await parseHotelWidget();
  }
  catch (error) {
    outputErrorMessage("Ошибка вставки шильдика RAK: ", error);
  }
})();