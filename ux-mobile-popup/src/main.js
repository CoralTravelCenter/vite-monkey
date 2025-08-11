import markup from './markup.html?raw';
import './style.scss';
import {generateRandomId, getMobileOS, insertOnce, isMobile} from "../../utils.js";

if (isMobile) {
  const OS = getMobileOS();
  const BODY = document.body;
  const randomId = generateRandomId();

  insertOnce(BODY, 'afterbegin', markup, randomId)

  const popup = document?.querySelector('#ux-mobile-popup');
  const content = popup?.querySelector('.ux-mobile-popup__content');
  const continueInApp = popup?.querySelector('[data-continue="app"]');
  const continueOnSite = popup?.querySelector('[data-continue="site"]');

  function showPopup() {
    content.classList.add('slide-in');
    BODY.classList.add('body-scroll-lock');
  }

  function hidePopup() {
    content.classList.remove('slide-in');
    content.addEventListener('transitionend', () => {
      BODY.classList.remove('body-scroll-lock');
      popup.classList.add('ux-mobile-popup-js-hidden');
    })

  }

  setTimeout(() => {
    showPopup()
  }, 3000)

  continueInApp.addEventListener('click', () => {
    switch (OS) {
      case 'iOS':
        window.open('https://apps.apple.com/app/id1497841397', '_blank');
        hidePopup()
        break;
      case 'android':
        window.open('https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile', '_blank');
        hidePopup()
        break;
    }
  })

  continueOnSite.addEventListener('click', () => {
    hidePopup()
  })
}
