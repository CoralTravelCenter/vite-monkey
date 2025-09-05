import markup from './markup.html?raw';
import './style.css';

function insertOnce(target, position, html) {
  if (!document.querySelector('.promo-ribbon')) {
    target.insertAdjacentHTML(position, html);
  }
}

const placeToInsert = document.querySelector('.PhotoGalleryMainCarousel_mainCarousel__0d_0x').parentElement
insertOnce(placeToInsert, 'beforeend', markup)
