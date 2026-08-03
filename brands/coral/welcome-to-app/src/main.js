import './style.css';
import MARKUP from './markup.html?raw';
import {getBrand, getMobileOS, insertOnce, reactDomObserver} from "@utils";

(function () {
  'use strict';

  const YM_ID = 96674199;
  const YM_EVENTS = {
    show: 'show',
    application: 'application',
    close: 'close',
  };

  const BRAND_LINKS = {
    coral: {
      iOS: 'https://apps.apple.com/app/id1497841397',
      android: 'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile',
    },
    sunmar: {
      iOS: 'https://apps.apple.com/app/id1509966009',
      android: 'https://play.google.com/store/apps/details?id=sunmar.ru.sunmarmobile',
    },
  };

  const SELECTORS = {
    containerToInsert: "div[class*='HeaderMobile_container']",
    headerMobile: '.header-mobile',
    menuContainer: "div[class*='HeaderHamburgerMenu_menuContainer']",
    banner: '.welcome-to-app',
    closeBtn: '.welcome-to-app__close',
    btnApple: '.welcome-to-app__download.apple',   // исправил "ap" -> "app"
    btnGoogle: '.welcome-to-app__download.google',
  };

  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, '\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : undefined;
  }

  function setSessionCookie(name, value, {path = '/'} = {}) {
    const parts = [`${name}=${encodeURIComponent(value)}`];
    if (path) parts.push(`path=${path}`);
    // без Max-Age/Expires — сессионная
    document.cookie = parts.join('; ');
  }

  const CLOSED_COOKIE = 'wta_closed';

  function sendYM(event) {
    try {
      if (typeof window.ym === 'function') {
        window.ym(YM_ID, 'reachGoal', event);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function addEventListenerSafe(element, event, handler, options) {
    element?.addEventListener(event, handler, options);
    return function remove() {
      element?.removeEventListener(event, handler, options);
    };
  }

  // MARKUP должен быть доступен в области видимости (оставляю как у вас)
  const placeToInsert = document.querySelector(SELECTORS.containerToInsert);
  if (!placeToInsert) return;

  insertOnce(placeToInsert, 'afterbegin', MARKUP, 'welcome-to-app');
  const banner = placeToInsert.querySelector(SELECTORS.banner);
  if (!banner) return;

  // Если ранее закрыт в этой сессии — не показываем
  if (getCookie(CLOSED_COOKIE) === '1') {
    banner.classList.add('js-hidden');
    const parentHidden = placeToInsert.parentElement;
    if (parentHidden) parentHidden.style.paddingTop = '0px';
    return;
  }

  // баннер реально добавлен и видим — отправляем show
  sendYM(YM_EVENTS.show);

  const OS = getMobileOS();
  const BRAND = getBrand();
  banner.classList.add(BRAND || '');

  const closeBtn = banner.querySelector(SELECTORS.closeBtn);
  const btnApple = banner.querySelector(SELECTORS.btnApple);
  const btnGoogle = banner.querySelector(SELECTORS.btnGoogle);

  if (OS === 'iOS') btnApple?.classList.remove('js-hidden');
  else if (OS === 'android') btnGoogle?.classList.remove('js-hidden');
  else {
    btnApple?.classList.remove('js-hidden');
    btnGoogle?.classList.remove('js-hidden');
  }

  const parent = placeToInsert.parentElement;
  if (!parent) return;

  function applyPadding(px) {
    parent.style.paddingTop = `${px}px`;
  }

  function getContainerHeight() {
    const rect = placeToInsert.getBoundingClientRect();
    return Math.max(0, Math.ceil(rect.height));
  }

  function updateLayout() {
    const height = getContainerHeight();
    applyPadding(height);
    document.querySelectorAll(SELECTORS.menuContainer).forEach((el) => {
      el.style.top = `${height}px`;
    });
  }

  const containerResizeObserver = new ResizeObserver(() => updateLayout());
  containerResizeObserver.observe(placeToInsert);

  reactDomObserver()
    .observeSelector$(SELECTORS.menuContainer, {emitRemove: false})
    .subscribe(() => updateLayout());

  updateLayout();

  // Helpers: единая процедура скрытия и установки куки
  function hideAndRemember() {
    banner.classList.add('js-hidden');
    setSessionCookie(CLOSED_COOKIE, '1');
    updateLayout();
  }

  function handleBannerClick(e) {
    // Игнорируем клик по крестику — для него отдельный хендлер
    if (e.target?.closest(SELECTORS.closeBtn)) return;

    // Отправляем application
    sendYM(YM_EVENTS.application);

    // Переход на установку приложения: скрываем баннер и ставим сессионную куку
    hideAndRemember();

    const link = BRAND ? BRAND_LINKS[BRAND]?.[OS] : undefined;
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  }

  function handleClose() {
    // Отправляем close, скрываем и ставим куку
    sendYM(YM_EVENTS.close);
    hideAndRemember();
  }

  addEventListenerSafe(banner, 'click', handleBannerClick);
  addEventListenerSafe(closeBtn, 'click', handleClose, {passive: true});
})();
