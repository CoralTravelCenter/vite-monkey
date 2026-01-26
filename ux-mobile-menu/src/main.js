import {debounce, getMobileOS, insertOnce, ReactDomObserver} from "../../utils.js";
import markup from "./markup.html?raw";
import "./styles/style.scss";
import {initScrollMenuBehavior} from "./initScrollMenuBehavior.js";

const CLICK_DEBOUNCE = 100;
const MENU_SHOW_DELAY = 500;

const IMESSAGE_LINK =
  "sms://open/?service=iMessage&recipient=urn:biz:d3809fd0-e2fe-4027-b27e-ae34bf28e38c&biz-intent-id=click_in_jivo";

// ✅ защита от повторной инициализации (SPA / повторный инжект)
if (window.__customMobileMenuInit) {
  // уже инициализировано — выходим
} else {
  window.__customMobileMenuInit = true;

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
   * data-page по роуту (важно: всегда чистим перед установкой)
   */
  function setPathTriggers() {
    document.body.removeAttribute("data-page");

    if (location.pathname.includes("booking/add-passenger")) {
      document.body.setAttribute("data-page", "add-passenger");
      return;
    }

    if (location.pathname.includes("hotels")) {
      document.body.setAttribute("data-page", "hotels");
      return;
    }
  }

  setPathTriggers();

  /**
   * Промо-ссылка
   * (без debounce — чтобы window.open не блочился как "не user gesture")
   */
  function setupPromoLink(link) {
    if (!link) return;

    link.addEventListener("click", () => {
      const href = link.getAttribute("data-link");
      if (!href) return;

      window.open(href, "_blank");
    });
  }

  setupPromoLink(customPromoLink);

  /**
   * Чат (jivo / iMessage)
   * iOS: без debounce, иначе Safari может блочить переход
   */
  function setupChatLink(link, osName) {
    if (!link || !osName) return;

    if (osName === "iOS") {
      link.addEventListener("click", () => {
        // для протоколов лучше так, чем window.open + debounce
        window.location.href = IMESSAGE_LINK;
      });
      return;
    }

    if (osName === "android") {
      const action = () => {
        if (window.jivo_api?.open) {
          window.jivo_api.open({start: "menu"});
        }
      };

      link.addEventListener("click", debounce(action, CLICK_DEBOUNCE));
    }
  }

  setupChatLink(customChatLink, os);

  /**
   * Кнопка пользователя / аватар
   */
  function setupUserLink(customLoginEl) {
    if (!customLoginEl) return;

    const unauthorized = customLoginEl.querySelector(".unauthorized");
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

      // чистим старый клон
      if (clonedAvatar?.parentNode) {
        clonedAvatar.parentNode.removeChild(clonedAvatar);
      }

      clonedAvatar = avatar.cloneNode(true);
      customLoginEl.appendChild(clonedAvatar);
    };

    // Неавторизованный: клик по кастомной кнопке дергает настоящий LoginButton
    new ReactDomObserver('a[class*="LoginButton"]', {
      onAppear: (loginButton) => {
        if (!loginButton) return;
        customLoginEl.onclick = () => loginButton.click();
      },
    }).start();

    // Авторизованный: аватар + меню аккаунта
    new ReactDomObserver('div[class*="LoginAccountMenu"]', {
      onAppear: (menu) => {
        if (!menu) return;

        const avatar = menu.querySelector(".ant-avatar");
        const first = avatar?.firstElementChild;
        if (first) first.style.opacity = "1";

        showAuthorized(avatar);

        // клик по кастомной кнопке — открыть настоящее меню аккаунта
        customLoginEl.onclick = () => {
          const trigger = menu.firstChild;
          if (trigger instanceof HTMLElement) {
            trigger.click();
          }
        };
      },

      onDisappear: () => {
        // ⚠️ не трогаем глобальные классы типа overflow-hidden — это может быть не наше
        showUnauthorized();
      },
    }).start();
  }

  setupUserLink(customLogin);

  /**
   * Бургер-меню
   */
  function setupHamburger(customHamburgerEl) {
    if (!customHamburgerEl) return;

    let isOpen = false;
    let headerHamburgerRef = null;

    const getHeaderHamburger = () =>
      document.querySelector('button[class*="HeaderHamburgerMenu"]');

    const syncUi = (open) => {
      isOpen = open;
      customHamburgerEl.classList.toggle("clicked", open);
      document.documentElement.classList.toggle("js-scroll-fix", open);
    };

    const forceClose = () => {
      if (!isOpen) return;
      syncUi(false);
      const btn = headerHamburgerRef || getHeaderHamburger();
      if (btn instanceof HTMLElement) btn.click();
    };

    // ✅ 1) Вешаем обработчик сразу (не ждём observer)
    const handleClick = () => {
      const btn = headerHamburgerRef || getHeaderHamburger();
      if (!(btn instanceof HTMLElement)) return; // ещё не отрендерилось

      syncUi(!isOpen);
      btn.click();
    };

    customHamburgerEl.addEventListener("click", handleClick);


    // ✅ 2) Observer только обновляет ссылку на актуальную кнопку (по желанию)
    new ReactDomObserver('button[class*="HeaderHamburgerMenu_menuButton__"]', {
      onAppear: (btn) => {
        headerHamburgerRef = btn;
      },
      onDisappear: () => {
        headerHamburgerRef = null;
        syncUi(false);
      },
    }).start();

    // ✅ 3) SPA-переход: закрываем и обновляем ref (после перехода может появиться новая кнопка)
    window.CoralRouteBus.subscribe(() => {
      forceClose();
      setPathTriggers();
      headerHamburgerRef = getHeaderHamburger();
    });
  }

  setupHamburger(customHamburger);

  /**
   * Flight sticky bar → отдельный UI-state, но хотя бы не ломаем роутовый data-page
   */
  new ReactDomObserver('div[class*="packageTourFlightStickyBarContainer"]', {
    onAppear: () => {
      document.body.setAttribute("data-page", "flight");
    },
    onDisappear: () => {
      // вместо полного сноса — возвращаем роутовую разметку
      setPathTriggers();
    },
  }).start();
}
