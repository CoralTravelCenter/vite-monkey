import {getCoralGlide} from './ohotnikNaKarusel.js'
import {loopCarousel} from './loopCarousel.js'
import './style.css'

const carousel = new getCoralGlide();

// await carousel.removeFirst(5);
await carousel.keepFirst(5);

await loopCarousel(carousel, {
  interval: 8000,
  hoverPause: true,
});
