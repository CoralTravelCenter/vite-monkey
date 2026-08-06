import './styles/style.scss';
import {initDevWidget} from "./scripts/devWidget/initDevWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function startInject() {
  try {
    if(import.meta.env.DEV) {
      await initDevWidget();
    } else {
      console.log("prodWidget");
    }
  } catch (error) {
    outputErrorMessage("Ошибки инициализации элемента: ", error);
  }
})();