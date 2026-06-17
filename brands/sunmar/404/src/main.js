import markup from './markup.html?raw';
import './style.css';

await hostReactAppReady()
document.getElementById('monkey-app').insertAdjacentHTML('afterbegin', markup)
