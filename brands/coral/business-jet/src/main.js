import './style.css';
import {initProdWidget} from "./scripts/ProdWidget/initProdWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function startInject() {
  try {
    if(!import.meta.env.DEV) {
      initProdWidget();
    }
    else {

    }
  }
  catch(error) {
    outputErrorMessage("Ошибка инициализации баннера business-jet: ", error);
  }
})();
