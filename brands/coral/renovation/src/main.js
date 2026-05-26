import markup from './markup.html?raw'
import './style.css'

const placeToInsert = document.querySelector('div[class*="PhotoGalleryMainCarousel_mainCarousel"]');
placeToInsert.insertAdjacentHTML('beforeend', markup)