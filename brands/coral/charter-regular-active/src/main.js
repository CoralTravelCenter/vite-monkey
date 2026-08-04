import {trackFlightTypeLoad} from "./scripts/trackFlightTypeLoad.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function startTrackFlightTypeLoad(){
  try {
    await trackFlightTypeLoad();
  } catch (error) {
    outputErrorMessage("Ошибка инициализации метрики чартера или регуляра: ", error);
  }
})();