import "./style.scss";
import { initSearchTrigger } from "./scripts/initSearchTrigger.js";

(async function injectPopup() {
  try {
    await initSearchTrigger();
  } catch (error) {
    console.error("Ошибка запуска попапа Черной пятницы:", error);
  }
})();
