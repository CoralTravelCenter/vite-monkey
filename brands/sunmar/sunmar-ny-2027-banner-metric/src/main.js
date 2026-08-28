import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {injectMetric} from "./scripts/injectMetric.js";

;(async function injectMetricBannerNY(){
  try {
    await injectMetric();
  }
  catch(error){
    outputErrorMessage("Не удалось вставить метрику в баннер: ", error);
  }
})();