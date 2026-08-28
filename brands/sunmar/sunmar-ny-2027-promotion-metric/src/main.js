import {injectMetric} from "./scripts/injectMetric.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function injectMetricBannerNY(){
  try {
    await injectMetric();
  }
  catch (error) {
    outputErrorMessage("Не удалось вставить метрику: ", error);
  }
})();