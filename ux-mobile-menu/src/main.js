import {insertOnce} from "../../utils.js";
import markup from './markup.html?raw';
import './style.scss';

function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  return 'other';
}

insertOnce(document.body, 'beforeend', markup)
ym(96674199, 'reachGoal', 'ab_mobile_menu_show')

const operationSystem = getMobileOS()
const userButton = document?.querySelector('.right-group button');
const customUserIcon = document?.querySelector('.custom-bottom-mobile-menu__user');
const burgerButton = document?.querySelector('.menu-button');
const customBurgerIcon = document?.querySelector('.custom-bottom-mobile-menu__burger');
const customPromoLink = document?.querySelector('.custom-bottom-mobile-menu__promo');
const customChatLink = document?.querySelector('.custom-bottom-mobile-menu__chat');

const closeMenuButton = document.querySelector('.menu-button-close')
if (closeMenuButton)
  closeMenuButton.addEventListener('click', (e) => {
    if (burgerButton) burgerButton.click()
  })

// Закрытие меню
if (closeMenuButton && burgerButton) {
  closeMenuButton.addEventListener('click', () => {
    burgerButton.click();
    customBurgerIcon?.classList.remove('clicked');
  });
}

// Пользователь
if (customUserIcon && userButton) {
  customUserIcon.addEventListener('click', () => {
    userButton.click();
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'account'});
  });
}

// Бургер
if (customBurgerIcon && burgerButton) {
  customBurgerIcon.addEventListener('click', (e) => {
    burgerButton.click();
    e.currentTarget.classList.toggle('clicked');
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'menu'});
  });
}

// Промо
if (customPromoLink) {
  customPromoLink.addEventListener('click', (e) => {
    e.preventDefault();
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'promo'});
    window.open(e.currentTarget.href, '_blank');
  });
}

// Чат
if (customChatLink) {
  switch (operationSystem) {
    case 'android':
      customChatLink.addEventListener('click', (e) => {
        e.preventDefault()
        const jivo = document?.querySelector('.logoIconCloud__YSx7A')
        jivo.click()
      })
      break;
    case 'iOS':
      customChatLink.addEventListener('click', (e) => {
        e.preventDefault();
        ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'jivo'});
        window.open(e.currentTarget.href, '_blank');
      });
      break;
  }
}
