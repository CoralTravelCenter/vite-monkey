import {register} from "swiper/element";
import kv from './markup/kv.html?raw';
import countries from './markup/countries.html?raw';
import './main.scss';
import './styles/countries.scss';

const markup = kv + countries;
document.querySelector('#monkey-app').insertAdjacentHTML('afterbegin', markup);
register()

const swiperEl = document.querySelector('swiper-container');
const swiperConfig = {
  slidesPerView: 1,
  enabled: true,
  spaceBetween: 16,
  pagination: {clickable: true},
  breakpoints: {
    769: {
      enabled: false,
      slidesPerView: 3
    }
  }
}
Object.assign(swiperEl, swiperConfig);
swiperEl.initialize();
