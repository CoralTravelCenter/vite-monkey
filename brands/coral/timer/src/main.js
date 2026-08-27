import markup from './markup.html?raw';
import './style.css';

const host = document.querySelector('#quick-search-tab-area');
document.querySelector('#quick-search-tab-area').insertAdjacentHTML('afterend', markup);
