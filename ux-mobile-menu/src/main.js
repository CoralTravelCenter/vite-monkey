import {debounce, getMobileOS, insertOnce, ReactDomObserver} from "../../utils.js";
import markup from "./markup.html?raw";
import "./styles/style.scss";
import {initScrollMenuBehavior} from "./initScrollMenuBehavior.js";

const CLICK_DEBOUNCE = 100;
const MENU_SHOW_DELAY = 500;
const IMESSAGE_LINK =
  "sms://open/?service=iMessage&recipient=urn:biz:d3809fd0-e2fe-4027-b27e-ae34bf28e38c&biz-intent-id=click_in_jivo";

insertOnce(document.body, "beforeend", markup, "custom-mobile-menu");

const customMenu = document?.querySelector("#custom-bottom-mobile-menu");
const customPromoLink = document?.querySelector(".custom-bottom-mobile-menu__promo");
const customChatLink = document?.querySelector(".custom-bottom-mobile-menu__chat");
const customHamburger = document?.querySelector(".custom-bottom-mobile-menu__burger");
const customLogin = document?.querySelector(".custom-bottom-mobile-menu__user");
const os = getMobileOS();

/**
 * Плавающее меню по скроллу
 */
if (customMenu) {
  initScrollMenuBehavior(customMenu, {showDelay: MENU_SHOW_DELAY});
}

/**
 * Промо-ссылка
 */
function setupPromoLink(link) {
  if (!link) return;

  const handleClick = debounce(() => {
    const href = link.getAttribute("data-link");
    if (!href) return;

    window.open(href, "_blank");
  }, CLICK_DEBOUNCE);

  link.addEventListener("click", handleClick);
}

setupPromoLink(customPromoLink);

/**
 * Чат (jivo / iMessage)
 */
function setupChatLink(link, os) {
  if (!link || !os) return;

  const strategies = {
    android: () => {
      if (window.jivo_api?.open) {
        window.jivo_api.open({start: "menu"});
      }
    },
    iOS: () => {
      window.open(IMESSAGE_LINK, "_blank");
    }
  };

  const action = strategies[os];
  if (!action) return;

  const handleClick = debounce(action, CLICK_DEBOUNCE);
  link.addEventListener("click", handleClick);
}

setupChatLink(customChatLink, os);

/**
 * Кнопка пользователя / аватар
 */
function setupUserLink(customLogin) {
  if (!customLogin) return;

  const unauthorized = customLogin.querySelector(".unauthorized");
  let clonedAvatar = null;

  const showUnauthorized = () => {
    unauthorized?.classList.remove("js-hidden");
    if (clonedAvatar?.parentNode) {
      clonedAvatar.parentNode.removeChild(clonedAvatar);
    }
    clonedAvatar = null;
  };

  const showAuthorized = (avatar) => {
    if (!avatar) return;

    unauthorized?.classList.add("js-hidden");

    // на всякий случай чистим старый клон
    if (clonedAvatar?.parentNode) {
      clonedAvatar.parentNode.removeChild(clonedAvatar);
    }

    clonedAvatar = avatar.cloneNode(true);
    customLogin.appendChild(clonedAvatar);
  };

  // Неавторизованный: клик по кастомной кнопке дергает настоящий LoginButton
  new ReactDomObserver('a[class*="LoginButton"]', {
    onAppear: (loginButton) => {
      if (!loginButton) return;
      customLogin.onclick = () => loginButton.click();
    }
  }).start();

  // Авторизованный: аватар + меню аккаунта
  new ReactDomObserver('div[class*="LoginAccountMenu"]', {
    onAppear: (menu) => {
      if (!menu) return;

      const avatar = menu.querySelector(".ant-avatar");
      avatar.firstChild.style.opacity = "1";
      showAuthorized(avatar);

      // клик по кастомной кнопке — открыть настоящее меню аккаунта
      customLogin.onclick = () => {
        const trigger = menu.firstChild;
        if (trigger instanceof HTMLElement) {
          trigger.click();
        }
      };
    },

    onDisappear: () => {
      // деавторизация или пропало меню
      document.body.classList.remove('overflow-hidden')
      showUnauthorized();
      // при следующем появлении LoginButton / LoginAccountMenu
      // обработчик будет переназначен в соответствующем onAppear
    }
  }).start();
}

setupUserLink(customLogin);

/**
 * Бургер-меню
 */
function setupHamburger(customHamburger) {
  if (!customHamburger) return;

  if (location.pathname.includes('booking/add-passenger')) {
    customHamburger.style.display = "none";
  }

  let handlerBound = false;

  new ReactDomObserver('button[class*="HeaderHamburgerMenu"]', {
    onAppear: (headerHamburger) => {
      if (!headerHamburger || handlerBound) return;

      const handleClick = () => {
        customHamburger.classList.toggle("clicked");
        headerHamburger.click();
      };

      customHamburger.addEventListener("click", handleClick);
      handlerBound = true;
    }
  }).start();
}

setupHamburger(customHamburger);

new ReactDomObserver('div[class*="packageTourFlightStickyBarContainer"]', {
  onAppear: () => {
    document.body.setAttribute('data-page', 'flight')
  },
  onDisappear: () => {
    document.body.removeAttribute('data-page')
  }
}).start();
if (location.pathname.includes('booking/add-passenger')) {
  document.body.setAttribute('data-page', 'add-passenger')
}
if (location.pathname.includes('hotels')) {
  document.body.setAttribute('data-page', 'hotels')
}
