import {awaitDomElement} from "../../../../utils/index.js";
import markup from './markup.html?raw'
import './style.scss'

const host = await awaitDomElement('div[class*="ReservationWidgetV2_reservationWidgetContainer__"]');
const servicesContainer = await awaitDomElement('div[class*="addedServiceItem');
const banner = document?.querySelector('.promotion-banner');
if (!banner) {
  host.insertAdjacentHTML('beforeend', markup)
}

// const transfer = getTransfer(servicesContainer);
// const transferButton = transfer?.querySelector('.basic-button-container');
// const trigger = document?.querySelector('[data-trigger-transfer]');
// if (trigger && transferButton) {
//   trigger.addEventListener('click', (e) => {
//     transferButton.click();
//   })
// }
