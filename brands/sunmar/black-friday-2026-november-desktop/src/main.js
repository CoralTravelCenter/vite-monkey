import  "./style.css";
import {initDesktopWidget} from "./scripts/initDesktopWidget.js";

(async function startSwapButton() {
    try {
        await initDesktopWidget();
    }
    catch {}
})();
