import popup from './markup.html?raw';
import './style.css';

import {PERSONALIZED_CONTENT_CONFIG} from './personalizedContentConfig.js';

document.body.insertAdjacentHTML('beforeend', popup);

const pop = document.querySelector('#kapsula-popup-search');

const headline = pop.querySelector('[data-personalized-hedline]');
const eridEl = pop.querySelector('[data-personalized-erid]');
const text = pop.querySelector('[data-personalized-text]');
const visual = pop.querySelector('[data-personalized-visual]');

function updatePersonalizedContent(path) {
  const normalizedPath = path.toLowerCase();

  console.log(PERSONALIZED_CONTENT_CONFIG)

  for (const {
    headline: groupHeadline,
    erid,
    text: groupText,
    countries,
  } of PERSONALIZED_CONTENT_CONFIG) {
    const country = countries.find(({url}) =>
      normalizedPath.includes(url),
    );

    if (!country) {
      continue;
    }


    headline.textContent = groupHeadline;
    text.textContent = groupText(country.destination);
    visual.style.backgroundImage = `url("${country.image}")`;
    eridEl.textContent = 'ООО «Центрбронь» erid: ' + erid;
    return;
  }
}

updatePersonalizedContent(window.location.pathname);

CoralRouteBus.subscribe(({path}) => {
  updatePersonalizedContent(path);
});
