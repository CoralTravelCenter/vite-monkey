import "./style.scss";
import {initWidget} from "./scripts/initWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
;(async function injectCoralShildRak() {
  try {
    await initWidget();
  }
  catch (error) {
    outputErrorMessage("Ошибка вставки шильдика RAK: ", error);
  }
})();