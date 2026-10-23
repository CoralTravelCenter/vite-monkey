import "./style.css";
import {initMobileWidget} from "./scripts/initMobileWidget.js";

(async function startSwapButton() {
  try {
    await initMobileWidget();
  }
  catch {}
})();
