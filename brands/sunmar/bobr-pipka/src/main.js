import './style.scss'
import markup from './markup.html?raw'

document.body.insertAdjacentHTML('beforeend', markup);

const host = document.querySelector('.bobr-pipka-wrapper');
const close = host.querySelector('.close');

if (close) {
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    host.style.display = 'none';
  });
}
