import markup from "./markup.html?raw";
import './style.css';
import {hostReactAppReady} from "../../utils.js";


(async () => {
  document.body.insertAdjacentHTML('beforeend', markup)
  await hostReactAppReady('.cpl-promo-ribbon')
  const popup = document?.querySelector('coral-popup');
  const trigger = document?.querySelector('.cpl-promo-ribbon')
  if (popup && trigger) {
    trigger.addEventListener('click', () => {
      console.log('clicked');
      popup.show()
    })
  }
})()
