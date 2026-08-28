import "./style.scss";
import {initWidget} from "./scripts/initWidget.js";
import {outputErrorMessage} from "./scripts/utils/errorMessage.js";

(async function injectMetricPopap(){
    try {
        await initWidget();
    }
    catch (error) {
        outputErrorMessage("Ошибка инициализации новогоднего попапа: ", error);
    }
})();