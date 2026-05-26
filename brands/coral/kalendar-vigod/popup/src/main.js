import markup from './markup.html?raw';
import styles from './style.css?raw';


const style = document.createElement('style');
style.textContent = styles;
document.head.appendChild(style);

const bfLabel = document.createElement('div');
bfLabel.className = 'bf-label';
bfLabel.innerHTML = markup;

document.body.appendChild(bfLabel);

const bfLabelIcon = bfLabel.querySelector('.js-bf-icon');
const bfLabelPopup = bfLabel.querySelector('.js-bf-popup');

if (window.innerWidth > 768) {
  bfLabelIcon.addEventListener('mouseenter', () => {
    bfLabelPopup.classList.add('visible');
    bfLabelIcon.classList.add('hidden');
    bfLabel.classList.add('hidden');

    bfLabelPopup.classList.remove('on-hide');

    ym(96674199, 'reachGoal', 'popupShow');
  });

  bfLabelPopup.addEventListener('mouseleave', () => {
    bfLabelPopup.classList.remove('visible');
    bfLabelIcon.classList.remove('hidden');
    bfLabel.classList.remove('hidden');

    bfLabelPopup.classList.add('on-hide');
  });
} else {
  const bfLabelBg = bfLabel.querySelector('.js-bf-bg');
  const bfLabelClose = bfLabel.querySelector('.js-bf-close');


  bfLabelIcon.addEventListener('click', () => {
    bfLabelPopup.classList.add('visible');
    bfLabelBg.classList.add('visible');
    bfLabelIcon.classList.add('hidden');
    bfLabel.classList.add('hidden');
    document.body.classList.add('js-scroll-lock')
    bfLabelPopup.classList.remove('on-hide');

    ym(96674199, 'reachGoal', 'popupShow');
  });

  bfLabelClose.addEventListener('click', () => {
    bfLabelPopup.classList.remove('visible');
    bfLabelBg.classList.remove('visible');
    bfLabelIcon.classList.remove('hidden');
    bfLabel.classList.remove('hidden');
    document.body.classList.remove('js-scroll-lock')
    bfLabelPopup.classList.add('on-hide');
  });
}

const button = document.querySelector('.js-bf-button');

button.addEventListener('click', (e) => {
  const ymParams = {
    name_stock: {
      black_friday: {
        name_point: "pop_up",
      },
    },
  }

  ym(96674199, "reachGoal", "entry-point", ymParams);
});
