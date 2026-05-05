import markup from './markup.html?raw';
import './style.css'
import {insertOnce} from "../../utils.js";

const placeToInsert = document?.querySelector('div[class*="headerMobileWrapper"]')

placeToInsert && insertOnce(placeToInsert, 'afterbegin', markup, 'ticker')

// mediaMatcher(769, isMobile => {
//   if (!isMobile) {
//     const placeToInsert = document?.querySelector('div[class*="headerMobileWrapper"]')
//     if (placeToInsert) insertOnce(placeToInsert, 'afterbegin', markup, 'ticker')
//
//   }
// })
