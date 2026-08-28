import "./style.scss";
import {injectWidget} from "./scripts/injectWidget.js";

;(async function injectTest2(){
  try {
    await injectWidget();
  }
  catch (error) {
    console.error(error);
  }
})();