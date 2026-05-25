import markup from './markup.html?raw'
import './style.css'
import {awaitDomElement} from "@utils";

const gallery = await awaitDomElement(
  '[class*="BannerHotelListCard_bannerHotelListCard__"]'
);
gallery.insertAdjacentHTML('beforebegin', markup)
