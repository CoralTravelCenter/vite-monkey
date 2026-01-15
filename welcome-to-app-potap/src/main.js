import Hammer from 'hammerjs';
import {getMobileOS, insertOnce, waitUntilElementsGone} from '../../utils.js';
import markup from './markup.html?raw';
import './style.css';

const CONFIG = {
  POPUP_DELAY: 1500, // единственная задержка перед показом
};
const LINKS = {
  iOS: 'https://apps.apple.com/app/id1497841397',
  android: 'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile',
};
const METRIKA_COUNTER_ID = 96674199;
const OS = getMobileOS();
const BODY_HIDDEN_CLASS = 'jivo-hidden';

insertOnce(document.body, 'beforeend', markup, 'welcome-to-app');

const popup = document?.getElementById('welcome-to-app-popup');
const stayHereBtn = document?.getElementById('stay-here');
const redirectBtn = document?.getElementById('go-to-app');

let popupTimerId = null;
let popupWasShown = false; // попап показан хотя бы раз
let stayTracked = false;   // зафиксировано "остался на сайте" для текущего показа

function trackGoal(name, params) {
  if (typeof ym !== 'function') return;

  if (params) {
    ym(METRIKA_COUNTER_ID, 'reachGoal', name, params);
  } else {
    ym(METRIKA_COUNTER_ID, 'reachGoal', name);
  }
}

// вместо уничтожения/инициализации — просто прячем/показываем стилями
function setPopupVisible(isVisible) {
  if (!popup) return;

  popup.setAttribute('data-show', String(isVisible));
  document.body.classList.toggle('js-scroll-lock', isVisible);
  document.body.classList.toggle(BODY_HIDDEN_CLASS, isVisible);
}

function showPopupWithDelay() {
  if (popupWasShown || !popup) return;

  clearTimeout(popupTimerId);

  popupTimerId = setTimeout(() => {
    popupWasShown = true;
    stayTracked = false; // новый показ — можно снова трекать "остался"

    trackGoal('apk_pop_up_show'); // показ попапа
    setPopupVisible(true);
  }, CONFIG.POPUP_DELAY);
}

function closePopupAndStay() {
  if (!stayTracked) {
    stayTracked = true;

    // пользователь остался на сайте (кнопка / фон / свайп)
    trackGoal('apk_pop_up_click', {button: 'responsive'});
  }
  setPopupVisible(false);
}

function handleRedirectClick() {
  const url = OS === 'iOS' ? LINKS.iOS : LINKS.android;

  // уход в приложение
  trackGoal('apk_pop_up_click', {button: 'app'});

  setPopupVisible(false);
  window.open(url, '_blank');
}

function handleStayOnSite() {
  closePopupAndStay();
}

function handlePopupClick(event) {
  const isOutside = !event.target.closest('.welcome-to-app-wrapper');
  if (isOutside) {
    closePopupAndStay('overlay');
  }
}

function initSwipeToClose(popupEl) {
  const swipeTrigger = popupEl.querySelector('#swipe-trigger');
  const swipeTrigger2 = popupEl.querySelector('.top-block');

  const attachSwipe = (element) => {
    if (!element) return;
    const manager = new Hammer(element);
    manager.get('swipe').set({direction: Hammer.DIRECTION_VERTICAL});
    manager.on('swipedown', () => {
      closePopupAndStay('swipe');
    });
  };

  attachSwipe(swipeTrigger);
  attachSwipe(swipeTrigger2);
}

if (popup) {
  initSwipeToClose(popup);
}

if (redirectBtn) {
  redirectBtn.addEventListener('click', handleRedirectClick);
}

if (stayHereBtn) {
  stayHereBtn.addEventListener('click', handleStayOnSite);
}

if (popup) {
  popup.addEventListener('click', handlePopupClick);
}

waitUntilElementsGone(
  {
    required: ['.cookie-agreement-content', '.departureCityPopupModal'],
  },
  () => {
    showPopupWithDelay();
  }
);
