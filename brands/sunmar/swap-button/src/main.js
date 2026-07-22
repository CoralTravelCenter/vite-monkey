import markup from './markup.html?raw';
import './style.css';

await hostReactAppReady();
document.querySelector('.HeaderMenuBar_menu__WkOx4').insertAdjacentHTML('afterend', markup);