import "./style.scss";
import {initProdWidget} from "./scripts/prodWidget/initProdWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";


(async function injectGNBMobile() {
    try {
        await initProdWidget();
    }
    catch (error) {
        outputErrorMessage("Ошибка инициализации GNB Mobile: ", error);
    }
})();