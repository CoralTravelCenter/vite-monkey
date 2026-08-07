import {getCoralGlide} from './ohotnikNaKarusel.js'

const carousel =
  new getCoralGlide();

await carousel.removeFirst(3);
// await carousel.keepFirst(3);
