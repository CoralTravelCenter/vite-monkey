import './style.css';
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";
import {initProdWidget} from "./scripts/prodWidget/initProdWidget.js";
import {initDevWidget} from "./scripts/devWidget/initDevWidget.js";

(async function startBanner() {
  try {
    if (!import.meta.env.DEV) {
      await initProdWidget();
    } else {
      await initDevWidget();
    }
  } catch(error) {
    outputErrorMessage("Ошибка запуска функции внедрения баннера:\n", error);
  }
})();