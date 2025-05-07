import markup from './markup.html?raw';
import './style.css';
import {
  getBrand,
  getMobileOS,
  hostReactAppReady,
  insertOnce,
  isMobile,
  ReactDomObserver,
  waitForLibrary
} from "../../utils.js";

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

const YM_COUNTER_ID = 215233;
const DEFAULT_PADDING = '65px';
const OPEN_PADDING = '136px';
const MENU_OPEN_TOP = '184px';
const MENU_CLOSED_TOP = '113px';
const OS = getMobileOS()
const BRAND = getBrand()

function openAppLink(brand, mobileOS) {
  const link = linksToApp[brand]?.[mobileOS];
  if (link) window.open(link, '_blank');
}

function triggerClick(e) {
  if (e.target.closest('.welcome-to-app__close')) return;

  ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_install', {
    page: location.pathname,
    store: OS,
  });

  if (BRAND) openAppLink(BRAND, OS);
}

function showCorrectDownloadButton() {
  const buttons = {
    Google: document.querySelector('.google'),
    AppStore: document.querySelector('.apple')
  };
  buttons[OS]?.classList.remove('js-hidden');
}

function setupObserver(mBanner, closeButton) {
  const observer = new ReactDomObserver('.mobile-hambuerger-menu-conainer', {
    onAppear: el => {
      el.style.top = !mBanner.classList.contains('js-hidden') ? MENU_OPEN_TOP : MENU_CLOSED_TOP;
      closeButton.addEventListener('click', () => {
        el.style.top = MENU_CLOSED_TOP;
      });
    }
  });
  observer.start();
}

function setupCloseButton(mBanner, closeButton) {
  closeButton?.addEventListener('click', () => {
    mBanner?.classList.add('js-hidden');
    mBanner.parentElement.parentElement.style.paddingTop = DEFAULT_PADDING;
    ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_close', {
      page: location.pathname,
      store: OS
    });
  });
}

hostReactAppReady().then(() => {
  if (!isMobile) return;

  const placeToInsert = document.querySelector('.header-mobile');
  const nativeBanner = document.querySelector('.mobile-app-banner-alert');

  if (placeToInsert && !nativeBanner) {
    insertOnce(placeToInsert, 'beforebegin', markup)
  }

  const mBanner = document.querySelector('.welcome-to-app');
  const closeButton = document.querySelector('.welcome-to-app__close');

  if (mBanner) {
    mBanner.parentElement.parentElement.style.paddingTop = OPEN_PADDING;
    mBanner.addEventListener('click', triggerClick);
  }

  waitForLibrary(() => window.ym).then(() => {
    ym(YM_COUNTER_ID, 'reachGoal', 'mobile_app_show', {
      page: location.pathname,
      store: OS
    });
  });

  showCorrectDownloadButton();
  setupObserver(mBanner, closeButton);
  setupCloseButton(mBanner, closeButton);
});
