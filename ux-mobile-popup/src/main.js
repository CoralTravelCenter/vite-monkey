import MARKUP from './markup.html?raw';
import './style.scss';

(function () {
  'use strict';

  const YM_ID = 96674199;
  const YM_SHOW_GOAL = 'apk_pop_up_show';
  const YM_CLICK_GOAL = 'apk_pop_up_click';
  const SHOW_DELAY_MS = 2000;
  const CLOSED_COOKIE = 'ux_popup_closed';

  const APP_LINKS = {
    iOS: 'https://apps.apple.com/app/id1497841397',
    android: 'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile',
  };

  function getMobileOS() {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPad|iPhone|iPod/i.test(ua)) return 'iOS';
    return 'other';
  }

  function insertOnce(target, position, html, marker = 'data-inserted') {
    if (!target || !position) return null;
    if (target.hasAttribute(marker)) return target.querySelector('#ux-mobile-popup');
    target.insertAdjacentHTML(position, html);
    target.setAttribute(marker, '1');
    return target.querySelector('#ux-mobile-popup');
  }

  function sendYM(goal, params) {
    try {
      if (typeof window.ym === 'function') {
        window.ym(YM_ID, 'reachGoal', goal, params);
      }
    } catch {
    }
  }

  function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  // --- ДОБАВЛЕНО: работа с сессионной cookie ---
  function getCookie(name) {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, '\$1') + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : undefined;
  }

  function setSessionCookie(name, value, {path = '/'} = {}) {
    const parts = [`${name}=${encodeURIComponent(value)}`];
    if (path) parts.push(`path=${path}`);
    // без Expires/Max-Age — живёт до конца сессии браузера и общая для всех вкладок
    document.cookie = parts.join('; ');
  }


  const jivo = {
    destroy() {
      try {
        window.jivo_destroy?.();
      } catch {
      }
    },
    init() {
      try {
        window.jivo_init?.();
      } catch {
      }
    },
  };


  const body = document.body;
  const popup = insertOnce(body, 'afterbegin', MARKUP);
  if (!popup) return;

  const content = popup?.querySelector('.ux-mobile-popup__content');
  const backdrop = popup?.querySelector('.ux-mobile-popup__backdrop');
  const btnApp = popup?.querySelector('[data-continue="app"]');
  const btnSite = popup?.querySelector('[data-continue="site"]');
  const OS = getMobileOS();

  body.classList.add('ux-popup-ready');

  function showPopup() {
    popup.hidden = false;
    body.classList.add('body-scroll-lock');

    if (!prefersReducedMotion()) {
      content.classList.add('slide-in');
    }

    sendYM(YM_SHOW_GOAL);

    jivo.destroy();
    setTimeout(() => content?.focus(), 0);
  }

  function hidePopup() {
    const cleanup = () => {
      body.classList.remove('body-scroll-lock');
      popup.classList.add('ux-mobile-popup-js-hidden');
      popup.hidden = true;
      jivo.init();
      setSessionCookie(CLOSED_COOKIE, '1');
    };


    setSessionCookie(CLOSED_COOKIE, '1');


    if (prefersReducedMotion()) {
      cleanup();
      return;
    }

    content.classList.remove('slide-in');
    content.addEventListener('transitionend', cleanup, {once: true});
  }

  function onClickApp() {
    if (OS === 'iOS') {
      window.open(APP_LINKS.iOS, '_blank', 'noopener,noreferrer');
      hidePopup();
    } else if (OS === 'android') {
      window.open(APP_LINKS.android, '_blank', 'noopener,noreferrer');
      hidePopup();
    } else {
      hidePopup();
    }
    sendYM(YM_CLICK_GOAL, {button: 'app'});
  }

  function onClickSite() {
    hidePopup();
    sendYM(YM_CLICK_GOAL, {button: 'responsive'});
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') hidePopup();
  }

  function onBackdrop(e) {
    if (e.target?.getAttribute('data-close') === 'backdrop') hidePopup();
  }

  btnApp?.addEventListener('click', onClickApp);
  btnSite?.addEventListener('click', onClickSite);
  document.addEventListener('keydown', onKeyDown, {passive: true});
  backdrop?.addEventListener('click', onBackdrop);


  if (getCookie(CLOSED_COOKIE) === '1') return;

  setTimeout(showPopup, SHOW_DELAY_MS);
})();
