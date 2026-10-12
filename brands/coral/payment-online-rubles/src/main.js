import "./style.scss";
import {initWidget} from "./scripts/initWidget.js";

;(async function initPaymentWidget() {
  try {
    await initWidget();
  }
  catch {}
})();