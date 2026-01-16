import {waitForWindowVar} from "../../utils.js";
// import popupMarkup from './popup.html?raw';
import markup from './markup.html?raw';
import './style.css';

(async () => {
  await customElements.whenDefined('coral-popup')

  const io = await waitForWindowVar('insider_object')
  const hotelId = Number(io?.product?.id)

  if (hotelId !== 1039) return;

  const placeToInsert = document?.querySelector('div[class*="PhotoGalleryMainCarousel_mainCarousel__"]');
  const trigger = document?.createElement('div');
  trigger.id = 'atlantis-promo-trigger'
  trigger.innerHTML = markup
  placeToInsert?.append(trigger);

  const popup = document?.getElementById('atlantis-promo-popup')
  trigger.addEventListener('click', () => {
    popup?.show?.();
  })
})()
