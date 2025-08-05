import {
  appendOnce,
  debounce,
  getMobileOS,
  insertOnce,
  isMobile,
  ReactDomObserver,
  sendYandexEventOnce
} from "../../utils.js";
import markup from './markup.html?raw';
import './style.scss';

function trackEvent(type) {
  ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: type});
}

function setupPromoLink(link) {
  if (!link) return;
  const debouncedLinkClick = debounce(e => {
    e.preventDefault();
    trackEvent('promo');
    window.open(link.href, '_blank');
  }, 100)
  link.addEventListener('click', debouncedLinkClick);
}

function setupChatLink(link, os) {
  if (!link) return;

  if (os === 'android') {
    const debouncedAndroidLinkClick = debounce(() => {
      trackEvent('jivo');
      if (window.jivo_api) jivo_api.open({start: 'menu'})
    })
    link.addEventListener('click', debouncedAndroidLinkClick);
  }

  if (os === 'iOS') {
    const debouncedAndroidLinkClick = debounce(() => {
      trackEvent('jivo');
      window.open(
        'sms://open/?service=iMessage&recipient=urn:biz:d3809fd0-e2fe-4027-b27e-ae34bf28e38c&biz-intent-id=click_in_jivo',
        '_blank'
      );
    }, 100)
    link.addEventListener('click', debouncedAndroidLinkClick);
  }
}

function setupBurgerButton(icon, button) {
  if (!icon || !button) return;
  icon.addEventListener('click', debounce(() => {
    button.click();
    icon.classList.toggle('clicked');
    trackEvent('menu');
  }, 100));
}

function setupCloseMenu(button, burger) {
  if (!button || !burger) return;
  button.addEventListener('click', () => burger.click());
}

function observeFlightPage(customMenu, customChatLink) {
  new ReactDomObserver('#package-tour-flight-widget-area', {
    onAppear: () => customMenu.setAttribute('data-step', 'flight')
  }).start();

  new ReactDomObserver('.package-tour-flight-sticky-bar', {
    onAppear: () => customChatLink.style.bottom = '100px'
  }).start();
}

function handleAuth(customUserIcon) {
  function observeLoggedOut() {
    new ReactDomObserver('.login-button-text', {
      onAppear: (el) => {
        customUserIcon.setAttribute('data-status', 'logged-out');
        const button = el.closest("button");
        const debouncedCustomUserIconClick = debounce(() => {
          button.click();
          trackEvent('account');
        }, 100);
        customUserIcon.addEventListener('click', debouncedCustomUserIconClick)
      }
    }).start();
  }

  function setLoggedInIcon(el) {
    customUserIcon.setAttribute('data-status', 'logged-in');
    const avatar = el.querySelector('.ant-avatar');

    Object.assign(el.firstChild.style, {
      width: '32px',
      height: '32px',
      display: 'none',
    });

    appendOnce(customUserIcon, avatar)
    customUserIcon.addEventListener('click', () => {
      el.firstChild.click();
    });
  }

  observeLoggedOut();

  new ReactDomObserver('.LoginAccountMenu_loginAccountMenu__dviPZ', {
    onAppear: setLoggedInIcon,
    onDisappear: observeLoggedOut
  }).start();
}

function observeChoseButton(menu) {
  new ReactDomObserver('.hotelDetailFixedSummaryContainer', {
    watchAttributes: true,
    attributeFilter: ['class'],
    onAttributeMutation: (el) => {
      if (el.classList.contains('hide')) {
        menu.style.bottom = '0'
      } else {
        menu.style.bottom = '58px'
      }
    }
  }).start();
}

if (isMobile) {
  insertOnce(document.body, 'beforeend', markup);

  sendYandexEventOnce('ab_mobile_menu_show', 2, () => {
    ym(96674199, 'reachGoal', 'ab_mobile_menu_show');
  });

  const OS = getMobileOS();

  const customMenu = document.getElementById('custom-bottom-mobile-menu');
  const customUserIcon = document.querySelector('.custom-bottom-mobile-menu__user');
  const burgerButton = document.querySelector('.menu-button');
  const customBurgerIcon = document.querySelector('.custom-bottom-mobile-menu__burger');
  const customPromoLink = document.querySelector('.custom-bottom-mobile-menu__promo');
  const customChatLink = document.querySelector('.custom-bottom-mobile-menu__chat');
  const closeMenuButton = document.querySelector('.menu-button-close');

  setupPromoLink(customPromoLink);
  setupChatLink(customChatLink, OS);
  setupCloseMenu(closeMenuButton, burgerButton);
  setupBurgerButton(customBurgerIcon, burgerButton);
  observeChoseButton(customMenu)

  if (location.pathname.includes('add-passenger')) {
    customMenu.setAttribute('data-step', 'booking');
  }

  observeFlightPage(customMenu, customChatLink);
  handleAuth(customUserIcon);
}
