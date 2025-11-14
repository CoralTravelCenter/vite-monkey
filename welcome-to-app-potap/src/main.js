import Hammer from 'hammerjs';
import {getMobileOS, insertOnce} from '../../utils.js';
import markup from './markup.html?raw';
import './style.css';

// ----------------------
// Константы и настройки
// ----------------------

// Ссылки на приложения
const LINKS = {
  iOS: 'https://apps.apple.com/app/id1497841397',
  android: 'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile',
};

// Определяем ОС (нужно только при редиректе)
const OS = getMobileOS();

// Вставляем HTML
insertOnce(document.body, 'beforeend', markup);

// DOM-элементы
const popup = document?.getElementById('welcome-to-app-popup');
const stayHereBtn = document?.getElementById('stay-here');
const redirectBtn = document?.getElementById('go-to-app');

// ----------------------
// Состояние
// ----------------------

let popupTimerId = null;

// Флаг: показали попап хотя бы один раз за эту сессию
let popupWasShown = false;

// ----------------------
// Jivo
// ----------------------

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

// ----------------------
// Управление попапом
// ----------------------

function setPopupVisible(isVisible) {
  if (!popup) return;

  if (isVisible) {
    jivoDestroy();
  } else {
    jivoInit();
    ym(96674199, 'reachGoal', 'apk_pop_up_click', {button: 'responsive'});
  }

  popup.setAttribute('data-show', String(isVisible));
  document.body.classList.toggle('js-scroll-lock', isVisible);
}

// Показ с задержкой (только один раз)
function showPopupWithDelay(delay = 1500) {
  if (popupWasShown || !popup) return;

  clearTimeout(popupTimerId);

  popupWasShown = true; // фиксируем, что попытка показа уже была
  ym(96674199, 'reachGoal', 'apk_pop_up_show');

  popupTimerId = setTimeout(() => {
    setPopupVisible(true);
  }, delay);
}

// ----------------------
// Обработчики кликов
// ----------------------

// Редирект — проверка ОС только здесь
function handleRedirectClick() {
  const url = OS === 'iOS' ? LINKS.iOS : LINKS.android;

  ym(96674199, 'reachGoal', 'apk_pop_up_click', {button: 'app'});
  window.open(url, '_blank');

  setPopupVisible(false);
}

// Остаться на сайте
function handleStayOnSite() {
  ym(96674199, 'reachGoal', 'apk_pop_up_click', {button: 'responsive'});
  setPopupVisible(false);
}

// Клик вне контента
function handlePopupClick(event) {
  const isOutside = !event.target.closest('.welcome-to-app-wrapper');
  if (isOutside) {
    setPopupVisible(false);
  }
}

// ----------------------
// Свайпы для закрытия
// ----------------------

function initSwipeToClose(popupEl) {
  const swipeTrigger = popupEl.querySelector('#swipe-trigger');
  const swipeTrigger2 = popupEl.querySelector('.top-block');

  const attachSwipe = (element) => {
    if (!element) return;
    const manager = new Hammer(element);
    manager.get('swipe').set({direction: Hammer.DIRECTION_VERTICAL});
    manager.on('swipedown', () => setPopupVisible(false));
  };

  attachSwipe(swipeTrigger);
  attachSwipe(swipeTrigger2);
}

if (popup) {
  initSwipeToClose(popup);
}

// ----------------------
// Навешиваем обработчики
// ----------------------

if (redirectBtn) {
  redirectBtn.addEventListener('click', handleRedirectClick);
}

if (stayHereBtn) {
  stayHereBtn.addEventListener('click', handleStayOnSite);
}

if (popup) {
  popup.addEventListener('click', handlePopupClick);
}

// ----------------------
// Наблюдение за баннерами
// ----------------------

// Ждём исчезновения баннеров — потом показываем
function onBothElementsGoneOrNeverAppeared(selector1, selector2, callback, timeoutMs = 2000) {
  let firstGone = false;
  let secondGone = false;

  let firstAppeared = false;
  let secondAppeared = false;

  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    callback();
  };

  // Если элементы так и не появились → вызвать callback
  const appearanceTimeout = setTimeout(() => {
    if (!firstAppeared && !secondAppeared) {
      finish();
    }
  }, timeoutMs);

  // Следим за исчезновением элемента, когда он уже появился
  const observeGone = (el, onGone) => {
    const obs = new MutationObserver(() => {
      if (!document.body.contains(el)) {
        obs.disconnect();
        onGone();
      }
    });

    obs.observe(document.body, {childList: true, subtree: true});
  };

  // Универсальная функция отслеживания одного элемента
  const watchElement = (selector, onAppear, onGone) => {
    const waitForAppear = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        waitForAppear.disconnect();
        onAppear();
        observeGone(el, onGone);
      }
    });

    const el = document.querySelector(selector);

    if (!el) {
      waitForAppear.observe(document.body, {childList: true, subtree: true});
    } else {
      onAppear();
      observeGone(el, onGone);
    }
  };

  // Запуск
  watchElement(
    selector1,
    () => {
      firstAppeared = true;
    },
    () => {
      firstGone = true;
      if (secondGone) {
        clearTimeout(appearanceTimeout);
        finish();
      }
    }
  );

  watchElement(
    selector2,
    () => {
      secondAppeared = true;
    },
    () => {
      secondGone = true;
      if (firstGone) {
        clearTimeout(appearanceTimeout);
        finish();
      }
    }
  );
}

// Старт логики показа
onBothElementsGoneOrNeverAppeared(
  '.cookie-agreement-content',
  '.departureCityPopupModal',
  () => {
    showPopupWithDelay();
  }
);
