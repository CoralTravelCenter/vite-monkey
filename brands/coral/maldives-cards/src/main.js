import './style.css';
import {initProdWidget} from "./scripts/prodWidget/initProdWidget.js";
import {initDevWidget} from "./scripts/devWidget/initDevWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

;(async function startInject() {
    try {
        if(!import.meta.env.DEV){
            initProdWidget();
        }
        else {
            await initDevWidget();
        }
    }
    catch (error) {
        outputErrorMessage("Ошибка инициализации компонентов: ", error);
    }
})();