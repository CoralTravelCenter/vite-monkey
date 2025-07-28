import markup from './markup.html?raw';
import './style.css';
import {getBrand, getMobileOS, hostReactAppReady, insertOnce, isMobile, ReactDomObserver} from "../../utils.js";

// --- Константы ---
const linksToApp = {
  coral: {
    AppStore: 'https://apps.apple.com/app/id1497841397',
    Google: ''
  },
  sunmar: {
    AppStore: 'https://apps.apple.com/app/id1509966009',
    Google: 'https://play.google.com/store/apps/details?id=sunmar.ru.sunmarmobile'
  }
};
const YM_COUNTER_ID = 96674199;
const OS = getMobileOS();
const BRAND = getBrand();

// --- Утилиты ---
function openAppLink(brand, mobileOS) {
  const link = linksToApp[brand]?.[mobileOS];
  if (link) window.open(link, '_blank');
}

function showCorrectDownloadButton() {
  const buttons = {
    Google: document.querySelector('.google'),
    AppStore: document.querySelector('.apple')
  };
  buttons[OS]?.classList.remove('js-hidden');
}

// --- Обработчики ---
function triggerClick(e) {
  if (e.target.closest('.welcome-to-app__close')) return;
  ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_install', {
    page: location.pathname,
    store: OS,
  });
  if (BRAND) openAppLink(BRAND, OS);
}

function setupObserver(mBanner, closeButton, getBannerPadding) {
  const observer = new ReactDomObserver('.mobile-hambuerger-menu-conainer', {
    onAppear: el => {
      const isBanner = mBanner.classList.contains('js-hidden');
      el.style.top = !isBanner ? `${getBannerPadding()}px` : `${getBannerPadding(true)}px`;
      closeButton.addEventListener('click', () => {
        el.style.top = `${getBannerPadding(true)}px`;
      });
    }
  });
  observer.start();
}

function setupCloseButton(mBanner, closeButton, resetPadding) {
  closeButton?.addEventListener('click', () => {
    mBanner?.classList.add('js-hidden');
    resetPadding();
    ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_close', {
      page: location.pathname,
      store: OS
    });
  });
}

// --- Основной поток ---
hostReactAppReady().then(() => {
  if (!isMobile) return;

  const headerClientSideMobile = document?.querySelector('.header-client-side-mobile > div');
  const placeToInsert = document?.querySelector('.header-mobile');
  const nativeBanner = document?.querySelector('.mobile-app-banner-alert');

  if (placeToInsert && !nativeBanner) {
    insertOnce(placeToInsert, 'beforebegin', markup);
  }

  requestAnimationFrame(() => {
    ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_show', {
      page: location.pathname,
      store: OS
    });

    const mBanner = document?.querySelector('.welcome-to-app');
    const closeButton = document?.querySelector('.welcome-to-app__close');
    if (!mBanner) return;

    // --- Управление padding ---
    let DEFAULT_PADDING = placeToInsert.offsetHeight;
    let BANNER_PADDING = mBanner.offsetHeight;
    const updatePadding = (isHidden = false) => {
      DEFAULT_PADDING = placeToInsert.offsetHeight;
      BANNER_PADDING = mBanner.offsetHeight;
      headerClientSideMobile.style.paddingTop = isHidden
        ? `${DEFAULT_PADDING}px`
        : `${BANNER_PADDING + DEFAULT_PADDING}px`;
    };
    updatePadding();
    const ro = new ResizeObserver(() => updatePadding());
    ro.observe(mBanner);
    const resetPadding = () => updatePadding(true);
    const getBannerPadding = (isHidden = false) => isHidden
      ? DEFAULT_PADDING
      : BANNER_PADDING + DEFAULT_PADDING;

    // --- Обработчики ---
    mBanner.addEventListener('click', triggerClick);
    showCorrectDownloadButton();
    setupObserver(mBanner, closeButton, getBannerPadding);
    setupCloseButton(mBanner, closeButton, resetPadding);
  });
});
