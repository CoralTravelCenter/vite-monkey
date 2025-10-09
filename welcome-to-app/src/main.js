import markup from './markup.html?raw';
import './style.css';
import {
  getBrand,
  getMobileOS,
  insertOnce,
  ReactDomObserver,
  runOncePerSession,
  sendYandexEventOnce
} from "../../utils.js";

(() => {
  const isExecute = runOncePerSession();

  if (!isExecute) return;
// --- Константы ---
  const linksToApp = {
    coral: {
      iOS: 'https://apps.apple.com/app/id1497841397',
      android: 'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile'
    },
    sunmar: {
      iOS: 'https://apps.apple.com/app/id1509966009',
      android: 'https://play.google.com/store/apps/details?id=sunmar.ru.sunmarmobile'
    }
  };

  const YM_COUNTER_ID = 96674199;
  const OS = getMobileOS();
  const BRAND = getBrand();

// --- Утилиты ---
  function openAppLink(brand, mobileOS) {
    const link = linksToApp?.[brand]?.[mobileOS];
    if (link && link.trim()) {
      window.open(link, '_blank');
    }
  }

  function showCorrectDownloadButton() {
    const buttons = {
      android: document.querySelector('.google'),
      iOS: document.querySelector('.apple')
    };
    if (buttons[OS]) {
      buttons[OS].classList.remove('js-hidden');
    }
  }

// --- Обработчики ---
  function triggerClick(e) {
    if (e.target.closest('.welcome-to-app__close')) return;
    ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_install', {
      page: location.pathname,
      store: OS,
    });
    openAppLink(BRAND, OS);
  }

  function setupObserver(mBanner, closeButton, getBannerPadding) {
    const observer = new ReactDomObserver('div[class*="HeaderHamburgerMenu_menuContainer"]', {
      onAppear: el => {
        if (!el || !mBanner) return;
        const isBannerHidden = mBanner.classList.contains('js-hidden');
        el.style.top = isBannerHidden
          ? `${getBannerPadding(true)}px`
          : `${getBannerPadding()}px`;

        closeButton?.addEventListener('click', () => {
          el.style.top = `${getBannerPadding(true)}px`;
        });
      }
    });

    if (observer?.start) observer.start();
  }

  function createResizeObserver(element, callback) {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        callback(entry.contentRect.height);
      }
    });
    resizeObserver.observe(element);
    return resizeObserver;
  }

// --- Инициализация ---
  const placeToInsert = document?.querySelector("div[class*='HeaderMobile_container']");
  const headerMobile = document?.querySelector(".header-mobile");

  if (placeToInsert) {
    insertOnce(placeToInsert, 'afterbegin', markup);

    sendYandexEventOnce('mobile_app_show', 2, () => {
      ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_show', {
        page: location.pathname,
        store: OS
      });
    })

    const mBanner = document.querySelector('.welcome-to-app');
    const closeButton = document.querySelector('.welcome-to-app__close');

    if (!mBanner) return;
    mBanner.classList.add(`${BRAND}`);

    // --- Управление padding ---
    let DEFAULT_PADDING = headerMobile?.offsetHeight || 0;
    let PADDING_WITH_BANNER;

    createResizeObserver(placeToInsert, (height) => {
      updatePadding(height)
      PADDING_WITH_BANNER = height
    });

    function updatePadding(padding) {
      placeToInsert.parentElement.style.paddingTop = `${padding}px`
    }

    function resetPadding() {
      placeToInsert.parentElement.style.paddingTop = `${DEFAULT_PADDING}px`
    }

    const getBannerPadding = (isHidden = false) =>
      isHidden ? DEFAULT_PADDING : PADDING_WITH_BANNER

    // --- Обработчики ---
    mBanner?.addEventListener('click', triggerClick);
    showCorrectDownloadButton();
    setupObserver(mBanner, closeButton, getBannerPadding);
    closeButton?.addEventListener('click', () => {
      mBanner.classList.add('js-hidden');
      resetPadding();

      ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_close', {
        page: location.pathname,
        store: OS === 'iOS' ? 'AppleStore' : 'GooglePlayStore'
      });
    });
  }
})()
