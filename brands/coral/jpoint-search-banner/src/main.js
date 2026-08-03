import markup from './markup.html?raw'
import './style.css'
import {waitForElement} from "@utils";

const gallery = await waitForElement(
  '[class*="BannerHotelListCard_bannerHotelListCard__"]'
);
gallery.insertAdjacentHTML('beforebegin', markup)
