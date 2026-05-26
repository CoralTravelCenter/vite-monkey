import {hostReactAppReady} from "../../utils.js";
import markup from './markup.html?raw';
import './style.css';

(async () => {
  await hostReactAppReady()
  const placeToInsert = document.querySelector('#footer-column').closest('.layout-container-limit')
  placeToInsert.insertAdjacentHTML('beforebegin', markup)
})()
