import markup from './markup.html?raw'
import './style.scss';

document.body.insertAdjacentHTML('beforeend', markup)
const attentionUl = document.querySelector('.ny-sale__attention');
const attentionTrigger = document.querySelector('.ny-sale__attention-trigger');
if (attentionUl && attentionTrigger) {
  attentionTrigger.addEventListener('click', (e) => {
    attentionUl.style.display = 'block';
    e.currentTarget.style.display = 'none';
  })
}
