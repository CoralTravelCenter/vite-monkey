import {reactDomObserver} from "../../utils/index.js";
import markup from './markup.html?raw'
import './style.css'

const selectorWatcher = reactDomObserver();

const gallery = await selectorWatcher.waitElement(
  '[class*="BannerHotelListCard_bannerHotelListCard__"]'
);
gallery.insertAdjacentHTML('beforebegin', markup)
