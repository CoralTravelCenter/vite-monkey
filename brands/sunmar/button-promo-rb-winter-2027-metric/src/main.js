import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {initWidget} from "./scripts/initWidget.js";

;(async function promotionMetricRBWinter() {
  try {
    await initWidget();
  } catch (error) {
    outputErrorMessage("Ошибка инициализации метрики RB-winter", error);
  }
})();