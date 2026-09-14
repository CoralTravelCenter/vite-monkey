import "./style.scss";
import {injectBanner} from "./scripts/injectBanner.js";
import {identTransfer} from "./scripts/identTransfer.js";

;(async function injectBannersAddPassenger() {
  injectBanner();
  try {
    await identTransfer();
  }
  catch {}
})();
