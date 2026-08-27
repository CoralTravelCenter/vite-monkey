import {waitForElement} from "@utils";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function injectMetric(){
  const selector = '.hero.hello-bar .contenu > a';
  const metric = "ym(215233, 'reachGoal', 'entry_point', {name_stock: {NY_26_27: {name_point: 'banner',},},});";
  try {
    const container = await waitForElement(selector);
    if (container) {
      container.setAttribute("onclick", metric);
    }
  }
  catch(error) {
    outputErrorMessage("Не удалось инициализировать метрику баннера: ", error);
  }
})();