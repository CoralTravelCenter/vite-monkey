import './style.css';
import {initProdWidget} from "./scripts/ProdWidget/initProdWidget.js";
import {initDevWidget} from "./scripts/DevWidget/initDevWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

;(async function startInject() {
    try {
        if(!import.meta.env.DEV) {
            initProdWidget();
        }
        else {
            await initDevWidget();
        }
    }
    catch(error) {
        outputErrorMessage("Ошибка инициализации китайских карточек", error);
    }
})();