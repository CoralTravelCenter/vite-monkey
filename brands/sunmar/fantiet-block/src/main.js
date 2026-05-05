import markup from "./markup.html?raw";
import {hostReactAppReady} from "../../utils.js";
import './style.css';

(async () => {
  await hostReactAppReady()
  document
    .querySelector('.sunmar.js-anchor')
    .insertAdjacentHTML('afterend', markup)
})()
