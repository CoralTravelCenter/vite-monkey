import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';
import icon from './icon.html?raw';
import markup from './markup.html?raw';
import './styles.css'

const triggerEl = document.createElement('span');
triggerEl.id = 'cb-tooltip-trigger'
triggerEl.innerHTML = icon
document.querySelector('#paymentCoralBonusArea h4').append(triggerEl);

tippy(triggerEl, {
  content: markup,
  allowHTML: true,
  interactive: true
});
