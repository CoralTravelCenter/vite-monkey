import './style.css';
import {initDevWidget} from "./scripts/devWidget/initDevWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {initProdWidget} from "./scripts/prodWidget/initProdWidget.js";

(async function initWidget() {
  try {
    if(import.meta.env.DEV) {
      await initDevWidget();
    } else {
      await initProdWidget();
    }
  } catch (error) {
    outputErrorMessage("Ошибка инициализации компонента business jet: ", error);
  }
})();