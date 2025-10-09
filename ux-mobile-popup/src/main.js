import './style.scss';
import MARKUP from './markup.html?raw';
import {SimpleReactDomObserver} from "../../utils.js";
import Hammer from 'hammerjs';
import Cookies from 'js-cookie';

(function () {
  'use strict';

  const YM_ID = 96674199;
  const YM_EVENTS = {show: 'show', application: 'application', close: 'close'};

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
    menuContainer: "div[class*='HeaderHamburgerMenu_menuContainer']",
    banner: '.welcome-to-app',
    closeBtn: '.welcome-to-app__close',
    btnApple: '.welcome-to-app__download.apple',
    btnGoogle: '.welcome-to-app__download.google',
    content: '.welcome-to-app__content' // уточни при интеграции
  };

  // ===== настройки куки =====
  const CLOSED_COOKIE = 'wta_closed';
  const CLOSED_COOKIE_DAYS = 7;

  // ===== вставка баннера =====
  function insertOnce(target, position, html, marker = 'data-wta-inserted') {
    if (!target) return null;
    if (!target.hasAttribute(marker)) {
      target.insertAdjacentHTML(position, html);
      target.setAttribute(marker, '1');
    }
    return target.querySelector(SELECTORS.banner);
  }

  function sendYM(event) {
    try {
      if (typeof window.ym === 'function') window.ym(YM_ID, 'reachGoal', event);
    } catch {
    }
  }

  function addEventListenerSafe(element, event, handler, options) {
    element?.addEventListener(event, handler, options);
    return () => element?.removeEventListener(event, handler, options);
  }

  // ===== инициализация =====
  const placeToInsert = document.querySelector(SELECTORS.containerToInsert);
  if (!placeToInsert) return;

  const banner = insertOnce(placeToInsert, 'afterbegin', MARKUP);
  if (!banner) return;

  // проверка куки (раз в неделю)
  if (Cookies.get(CLOSED_COOKIE) === '1') {
    banner.classList.add('js-hidden');
    const parentHidden = placeToInsert.parentElement;
    if (parentHidden) parentHidden.style.paddingTop = '0px';
    return;
  }

  sendYM(YM_EVENTS.show);

  function getMobileOS() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/i.test(ua)) return 'iOS';
    return 'other';
  }

  function getBrand() {
    const host = location.host;
    if (host.includes('sunmar')) return 'sunmar';
    if (host.includes('coral')) return 'coral';
    return null;
  }

  const OS = getMobileOS();
  const BRAND = getBrand();
  banner.classList.add(BRAND || '');

  const closeBtn = banner.querySelector(SELECTORS.closeBtn);
  const btnApple = banner.querySelector(SELECTORS.btnApple);
  const btnGoogle = banner.querySelector(SELECTORS.btnGoogle);
  const contentEl = banner.querySelector(SELECTORS.content);

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

  const containerResizeObserver = new ResizeObserver(updateLayout);
  containerResizeObserver.observe(placeToInsert);

  const menuObserver = new SimpleReactDomObserver(SELECTORS.menuContainer, {
    onAppear: updateLayout,
  });
  menuObserver.start();

  updateLayout();

  // ===== скрытие + кука =====
  let tearDownFns = [];

  function hideAndRemember() {
    banner.classList.add('js-hidden');
    Cookies.set(CLOSED_COOKIE, '1', {expires: CLOSED_COOKIE_DAYS, path: '/'});
    updateLayout();

    try {
      containerResizeObserver.disconnect();
    } catch {
    }
    try {
      menuObserver.stop?.();
    } catch {
    }
    for (const off of tearDownFns) {
      try {
        off();
      } catch {
      }
    }
    tearDownFns = [];
  }

  // ===== клики =====
  function handleBannerClick(e) {
    if (e.target?.closest(SELECTORS.closeBtn)) return;

    // клик по фону вне контента
    if (contentEl && !e.target.closest(SELECTORS.content)) {
      sendYM(YM_EVENTS.close);
      hideAndRemember();
      return;
    }

    sendYM(YM_EVENTS.application);
    hideAndRemember();

    const link = BRAND ? BRAND_LINKS[BRAND]?.[OS] : undefined;
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  }

  function handleClose() {
    sendYM(YM_EVENTS.close);
    hideAndRemember();
  }

  const offClick = addEventListenerSafe(banner, 'click', handleBannerClick);
  const offClose = addEventListenerSafe(closeBtn, 'click', handleClose, {passive: true});
  tearDownFns.push(offClick, offClose);

  // ===== свайп вниз через Hammer.js =====
  function setupSwipeToClose() {
    if (!banner) return;

    const manager = new Hammer.Manager(banner);

    const swipe = new Hammer.Swipe({
      direction: Hammer.DIRECTION_VERTICAL,
      threshold: 10,
      velocity: 0.2,
    });
    manager.add(swipe);

    manager.on('swipedown', () => {
      sendYM(YM_EVENTS.close);
      hideAndRemember();
    });

    const pan = new Hammer.Pan({
      direction: Hammer.DIRECTION_VERTICAL,
      threshold: 5,
    });
    manager.add(pan);

    let maxDeltaY = 0;
    manager.on('panmove', (ev) => {
      maxDeltaY = Math.max(maxDeltaY, ev.deltaY || 0);
    });
    manager.on('panend', () => {
      if (maxDeltaY > 60) {
        sendYM(YM_EVENTS.close);
        hideAndRemember();
      }
      maxDeltaY = 0;
    });

    tearDownFns.push(() => manager.destroy());
  }

  setupSwipeToClose();
})();
