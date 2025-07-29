import {debounce, insertOnce, ReactDomObserver} from "../../utils.js";
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

// Промо
if (customPromoLink) {
  const debouncedPromoTrigger = debounce((e) => {
    e.preventDefault();
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'promo'});
    window.open(e.currentTarget.href, '_blank');
  }, 250)
  customPromoLink.addEventListener('click', debouncedPromoTrigger);
}

// Чат
if (customChatLink) {
  switch (operationSystem) {
    case 'android':
      const debouncedAndroidChatTrigger = debounce((e) => {
        e.preventDefault()
        ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'jivo'});
        jivo_api.open({start: 'menu'})
      }, 250)
      customChatLink.addEventListener('click', debouncedAndroidChatTrigger)
      break;
    case 'iOS':
      const debouncedIOSChatTrigger = debounce((e) => {
        e.preventDefault();
        ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'jivo'});
        window.open(e.currentTarget.href, '_blank');
      }, 250)
      customChatLink.addEventListener('click', debouncedIOSChatTrigger)
      break;
  }
}

// Пользователь
if (customUserIcon && userButton) {
  const debouncedUserTrigger = debounce(() => {
    userButton.click();
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'account'});
  }, 250)
  customUserIcon.addEventListener('click', debouncedUserTrigger);
}

// Закрытие меню
const closeMenuButton = document.querySelector('.menu-button-close')
if (closeMenuButton)
  closeMenuButton.addEventListener('click', (e) => {
    if (burgerButton) burgerButton.click()
  })


// Бургер
if (customBurgerIcon && burgerButton) {
  const debouncedMenuTrigger = debounce(() => {
    burgerButton.click();
    customBurgerIcon.classList.toggle('clicked');
    ym(96674199, 'reachGoal', 'ab_mobile_menu', {link: 'menu'});
  }, 250)
  customBurgerIcon.addEventListener('click', debouncedMenuTrigger);
}


//Убираем крестик с бургера при переходе на другую страницу
const observer = new ReactDomObserver('.mobile-hambuerger-menu-conainer', {
  onDisappear: () => {
    if (customBurgerIcon && burgerButton) {
      customBurgerIcon.classList.remove('clicked');
    }
  }
})
observer.start()
