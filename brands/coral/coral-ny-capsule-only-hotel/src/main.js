import "./style.scss";
import { leavePage } from "./scripts/leavePage.js";
import { timer } from "./scripts/timer.js";

(function injectCoralCapsuleOnlyHotel() {
  try {
    leavePage();
    timer();
  } catch {}
})();
