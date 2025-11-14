import Headroom from "headroom.js";
import {appendOnce, debounce, getMobileOS, insertOnce, ReactDomObserver} from "../../utils.js";
import markup from "./markup.html?raw";
import "./style.scss";


insertOnce(document.body, "beforeend", markup);

const customMenu = document?.querySelector("#custom-bottom-mobile-menu");
const customPromoLink = document?.querySelector(
  ".custom-bottom-mobile-menu__promo"
);
const customChatLink = document?.querySelector(
  ".custom-bottom-mobile-menu__chat"
);
const customHumburger = document?.querySelector(
  ".custom-bottom-mobile-menu__burger"
);
const userSlot = document?.querySelector('#user-slot');
const os = getMobileOS()

function setHeadroomLib() {
  new Headroom(customMenu, {
    tolerance: {
      up: 5,
      down: 5,
    },
    offset: 0,
    classes: {
      initial: "headroom",
      pinned: "headroom--pinned",
      unpinned: "headroom--unpinned",
    }
  }).init();
}

customMenu && setHeadroomLib();

function setupPromoLink(link) {
  if (!link) return;

  const handleClick = debounce(() => {
    const href = link.getAttribute("data-link");
    if (!href) return;

    window.open(href, "_blank");
  }, 100);

  link.addEventListener("click", handleClick);
}

customPromoLink && setupPromoLink(customPromoLink);

function setupChatLink(link) {
  if (!link || !os) return;

  const strategies = {
    android: () => {
      if (window.jivo_api?.open) {
        window.jivo_api.open({start: "menu"});
      }
    },

    iOS: () => {
      window.open(
        "sms://open/?service=iMessage&recipient=urn:biz:d3809fd0-e2fe-4027-b27e-ae34bf28e38c&biz-intent-id=click_in_jivo",
        "_blank"
      );
    }
  };

  const action = strategies[os];
  if (!action) return;

  link.addEventListener("click", debounce(action, 100));
}

customChatLink && setupChatLink(customChatLink);

function setupUserLink() {
  new ReactDomObserver(
    'a[class*="LoginButton"]',
    {
      onAppear: (loginButton) => {
        if (loginButton) {
          appendOnce(userSlot, loginButton)
        }
      }
    }
  ).start();
}

userSlot && setupUserLink()

function setupHumburger() {
  new ReactDomObserver('button[class*="HeaderHamburgerMenu"]', {
    onAppear: (el) => {
      customHumburger.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("clicked");
        el.click()
      })
    }
  }).start()
}

customHumburger && setupHumburger()

// new ReactDomObserver('div[class*="HotelDetailFixedSummary"]', {
//   watchAttributes: true,
//   attributeFilter: ['class'],
//   onAttributeMutation: (el) => {
//     el.style.bottom = "69px";
//   }
// }).start();
