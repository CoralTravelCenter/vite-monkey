import "./style.scss";
import "./scripts/assets/sunmarino-0.1.3.iife.js";
import {initWidget} from "./scripts/initWidget.js";

;(async function initBadgeTest() {
    try {
        await initWidget();
    } catch {}
})();