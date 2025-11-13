import markup from './markup.html?raw';
import {insertOnce} from "../../utils.js";
import './style.css'

const mobilePlace = document?.querySelector('[data-wta-inserted]');
mobilePlace ? insertOnce(mobilePlace, 'afterbegin', markup) : insertOnce(document.body, 'afterbegin', markup);
