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
const POPUP_SESSION_KEY = 'welcome_to_app_popup_shown_session';

// куда всегда монтируем попап
const POPUP_MOUNT_NODE = document.body;
insertOnce(POPUP_MOUNT_NODE, 'beforeend', markup, 'welcome-to-app-popup');

let popup = document?.getElementById('welcome-to-app-popup');
const stayHereBtn = document?.getElementById('stay-here');
const redirectBtn = document?.getElementById('go-to-app');

let popupTimerId = null;
let popupWasShown = hasPopupBeenShownThisSession(); // попап показан хотя бы раз
let stayTracked = false;   // зафиксировано "остался на сайте" для текущего показа

function hasPopupBeenShownThisSession() {
  try {
    return sessionStorage.getItem(POPUP_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function markPopupShownThisSession() {
  try {
    sessionStorage.setItem(POPUP_SESSION_KEY, '1');
  } catch {
    // ничего, если sessionStorage недоступен
  }
}

function trackGoal(name, params) {
  if (typeof ym !== 'function') return;

  if (params) {
    ym(METRIKA_COUNTER_ID, 'reachGoal', name, params);
  } else {
    ym(METRIKA_COUNTER_ID, 'reachGoal', name);
  }
}

function jivoInit() {
  if (typeof jivo_init === 'function') {
    jivo_init();
  }
}

function jivoDestroy() {
  if (typeof jivo_destroy === 'function') {
    jivo_destroy();
  }
}

/**
 * Показ / скрытие попапа.
 * При скрытии запускается анимация, по завершении — попап удаляется из DOM.
 * При показе — если попап уже удалён, он снова вставляется в DOM.
 */
function setPopupVisible(isVisible) {
  if (!popup) return;

  if (isVisible) {
    // если попап был удалён — вернуть в DOM
    if (!POPUP_MOUNT_NODE.contains(popup)) {
      POPUP_MOUNT_NODE.appendChild(popup);
    }

    jivoDestroy();
    document.body.classList.add('js-scroll-lock');

    // даём один кадр на reflow, затем включаем "показ"
    requestAnimationFrame(() => {
      if (popup) {
        popup.setAttribute('data-show', 'true');
      }
    });
  } else {
    jivoInit();
    document.body.classList.remove('js-scroll-lock');
    popup.setAttribute('data-show', 'false');
    // дальше по окончании анимации/transition попап будет удалён
  }
}

/**
 * Удаляем попап из DOM после окончания анимации/transition скрытия.
 * Важно: реагируем только когда попап в состоянии data-show="false".
 */
function handlePopupHideAnimationEnd(event) {
  if (!popup) return;

  // реагируем только на корневой попап (на случай внутренних анимаций)
  if (event.target !== popup) return;

  const isHiddenState = popup.getAttribute('data-show') === 'false';

  if (isHiddenState && popup.isConnected) {
    popup.remove();
  }
}

function showPopupWithDelay() {
  if (popupWasShown || !popup) return;

  clearTimeout(popupTimerId);

  popupTimerId = setTimeout(() => {
    if (popupWasShown) return; // защита, если за время таймера что-то поменялось

    popupWasShown = true;
    markPopupShownThisSession(); // ✨ запоминаем показ в sessionStorage
    stayTracked = false;

    trackGoal('apk_pop_up_show');
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

// инициализация свайпов
if (popup) {
  initSwipeToClose(popup);
}

// клики по кнопкам
if (redirectBtn) {
  redirectBtn.addEventListener('click', handleRedirectClick);
}

if (stayHereBtn) {
  stayHereBtn.addEventListener('click', handleStayOnSite);
}

// клик по оверлею
if (popup) {
  popup.addEventListener('click', handlePopupClick);
  const animatedWrapper = popup?.querySelector('.welcome-to-app-wrapper');
  if (animatedWrapper) {
    animatedWrapper.addEventListener('transitionend', handlePopupHideAnimationEnd);
  }
}

// ждём, пока исчезнут блокирующие элементы, и только затем показываем попап
waitUntilElementsGone(
  {
    floating: ['.cookie-agreement-content', '.departureCityPopupModal', '.push-noty']
  },
  () => {
    showPopupWithDelay();
  }
);
