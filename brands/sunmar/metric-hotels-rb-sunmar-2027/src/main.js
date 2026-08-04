import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {sendMetricButton} from "./scripts/prodScript/hotelsBlockCountries/sendMetricButton.js";
import {sendMetricsBlock} from "./scripts/prodScript/checkLoadBlock/sendMetricBlock.js";

(async function startHotelsMetric(){
  sendMetricButton();
  try {
    await sendMetricsBlock();
  } catch (error) {
    outputErrorMessage("Ошибка инициализации метрики семейного блока", error);
  }
})();