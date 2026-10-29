import "./style.scss";
import { initSearchTrigger } from "./scripts/initSearchTrigger.js";

(async function injectPopup() {
  try {
    await initSearchTrigger();
  } catch {}
})();
