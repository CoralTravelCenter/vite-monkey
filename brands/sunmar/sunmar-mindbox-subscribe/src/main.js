import {insertOnce} from "../../utils.js";
import markup from './markup.html?raw';
import './style.css'

const footer = document.querySelector(
  '[class*="FooterWidget_footerWidget"]'
);

insertOnce(footer.closest('.row-container'), 'afterbegin', markup)
