import markup from './markup.html?raw';
import './style.css';

const section = document.querySelector('section.coral-bonus')
if (section) section.insertAdjacentHTML('beforebegin', markup)
