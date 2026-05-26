import './style.css'
import dayjs from "dayjs";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter);
import Cookies from "js-cookie";
import {getBrand, hostReactAppReady, mediaMatcher} from "../../utils.js";


/**
 * @typedef {Object} PromoPopupConfig
 * @property {string} headline - Заголовок попапа.
 * @property {{ text: string, action?: string | null }} button - Кнопка действия. Если задан `action`, рендерится как <a>; иначе — <button>.
 * @property {string} discount_size - Значение скидки, например: "3%".
 * @property {string} symbol - Символ для отображения в "баббле", например: "%".
 * @property {string} poster - Ссылка на изображение.
 * @property {string} erid - Уникальный идентификатор для Erid и cookies.
 * @property {string} underline - HTML-текст под заголовком, поясняющий условия (чаще всего с HTML).
 * @property {string[]} conditions - Основные условия акции (рендерятся как список).
 * @property {string[]} attention - Мелкий текст/оговорки под списком условий.
 * @property {string} promo_start - Дата и время старта акции в формате "YYYY-MM-DD HH:mm".
 * @property {string} promo_end - Дата и время окончания акции в формате "YYYY-MM-DD HH:mm".
 * @property {boolean} autoplay - Автоматически показывать попап один раз в день.
 * @property {{ open?: any[] | null, close?: any[] | null }} yMetrika - Аргументы для window.ym: массив [id, "reachGoal", "event"], или null если не используется.
 */

/** @type {PromoPopupConfig} */
window.pop_up_manager = {
  headline: "",
  button: {
    text: "Продолжить бронирование",
    action: 'close'
  },
  discount_size: "",
  symbol: "₽",
  poster: "https://b2ccdn.sunmar.ru/content/sunmar_popup_no_mark.webp",
  erid: "Реклама &laquo;ООО Центрбронь&raquo; erid: 2W5zFHqDgo",
  underline: "Отправляйтесь в отпуск мечты<br> со скидкой до <strong>13 000 ₽*</strong> по промокоду <strong class='strong'>МАЙ.</strong><br> Мир ждет, чтобы вы его открыли!",
  conditions: [
    "Промокод: <strong class='strong'>МАЙ</strong>",
    "Даты акции: с 29.04.2025 по 05.05.2025",
    "Даты начала отдыха: май 2025 г.",
    "Направления: все, кроме России, Абхазии<br> и&nbsp;стран СНГ"
  ],
  attention: [
    "<strong>Чтобы воспользоваться промокодом, введите его в поле «Примечание к заказу» или сообщите менеджеру</strong><br><br>",
    "* Скидка 3&nbsp;000&nbsp;₽ на&nbsp;туры и&nbsp;отели от&nbsp;100&nbsp;000&nbsp;₽. Скидка 6&nbsp;000&nbsp;₽ на&nbsp;туры и&nbsp;отели от&nbsp;200&nbsp;000&nbsp;₽. Скидка 9&nbsp;000&nbsp;₽ на&nbsp;туры и&nbsp;отели от&nbsp;300&nbsp;000&nbsp;₽. Скидка 13&nbsp;000&nbsp;₽ на&nbsp;туры и&nbsp;отели от&nbsp;450&nbsp;000&nbsp;₽. Акция не&nbsp;суммируется с&nbsp;действующими акциями, программой лояльности SunmarBonus, рассрочками и&nbsp;картой рассрочки Халва. Акция распространяется только на&nbsp;новые неоплаченные бронирования пакетных туров или отелей. Акция по&nbsp;промокоду действует только при самостоятельном бронировании тура на&nbsp;sunmar.ru."
  ],
  promo_start: "2025-04-29 13:17",
  promo_end: "2025-05-05 23:30",
  autoplay: true,
  yMetrika: {
    open: [215233, 'reachGoal', 'pop_up', {'promocode': 'may'}],
    close: null
  }
}

const INSERT_PLACES = {
  sunmar: {
    desktop: {element: document.querySelector(".v2-left-part"), method: 'prepend'},
    mobile: {element: document.querySelector(".right-group"), method: 'append'}
  },
  coral: {
    desktop: {element: document.querySelector(".v2-left-part")?.parentElement, method: 'prepend'},
    mobile: {element: document.querySelector(".right-group"), method: 'append'}
  }
};

const BRAND = getBrand();

class PromoPopup {
  constructor(config) {
    this.config = config;
    this.popup = null;
    this.cookieKey = `popup_shown_${config.erid || "default"}`;
  }

  init() {
    const turnOn = dayjs().isSameOrAfter(dayjs(pop_up_manager.promo_start))
    const turnOff = dayjs().isSameOrAfter(dayjs(pop_up_manager.promo_end))

    if (!turnOn || turnOff) return

    this.renderBubble();
    this.bindTrigger();

    if (this.config.autoplay && this.shouldShowToday()) {
      this.showPopup();
      this.markAsShown();
    }
  }


  shouldShowToday() {
    return !Cookies.get(this.cookieKey);
  }

  markAsShown() {
    Cookies.set(this.cookieKey, "1", {expires: dayjs().endOf("day").toDate(), path: "/"});
  }

  renderBubble() {
    const bubble = this.createBubble();
    mediaMatcher(992, isMobile => {
      const place = isMobile ? INSERT_PLACES[BRAND]?.mobile : INSERT_PLACES[BRAND]?.desktop;
      if (place && place.element && !place.element.querySelector(".promo-bubble")) {
        place.method === 'prepend' ? place.element.prepend(bubble) : place.element.append(bubble);
      }
    });
  }

  createBubble() {
    const {symbol, discount_size} = this.config;
    const bubble = document.createElement("div");
    bubble.className = "promo-bubble";

    bubble.innerHTML = `
      <div class="icon">
        <div class="icon-text">${symbol}</div>
      </div>
      <div class="text">
        <p>Получите <br> скидку ${discount_size}</p>
      </div>
    `;

    return bubble;
  }

  createPopup() {
    const wrap = document.createElement("div");
    wrap.id = "coral-popup";
    wrap.className = "coral-popup";
    wrap.innerHTML = this.getPopupHtml();

    wrap.querySelectorAll("[data-close]").forEach(btn => btn.addEventListener("click", this.hidePopup));
    document.addEventListener("keydown", this.onEscape);
    document.body.addEventListener("click", this.onClickOutside);

    const aBtn = wrap.querySelector("a.prime-btn");
    if (aBtn) {
      aBtn.addEventListener("click", e => {
        e.preventDefault();
        this.track("close");
        window.open(aBtn.href, "_blank");
        this.hidePopup();
      });
    }

    this.popup = wrap;
    return wrap;
  }

  getPopupHtml() {
    const {headline, poster, erid, underline, conditions, attention} = this.config;
    return `
      <div class="content">
        <div class="content__body">
          <button class="close" data-close>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3.63319 3.63243C3.80405 3.46158 4.08105 3.46158 4.25191 3.63243L7.00076 6.38128L9.7496 3.63243C9.92046 3.46158 10.1975 3.46158 10.3683 3.63243C10.5392 3.80329 10.5392 4.0803 10.3683 4.25115L7.61948 7L10.3683 9.74885C10.5392 9.9197 10.5392 10.1967 10.3683 10.3676C10.1975 10.5384 9.92046 10.5384 9.7496 10.3676L7.00076 7.61872L4.25191 10.3676C4.08105 10.5384 3.80405 10.5384 3.63319 10.3676C3.46234 10.1967 3.46234 9.9197 3.63319 9.74885L6.38204 7L3.63319 4.25115C3.46234 4.0803 3.46234 3.80329 3.63319 3.63243Z"
                fill="#535353"></path>
            </svg>
          </button>
          <div class="img-wrapper">
            <div class="vimeo-video-box">
              <span class="erid">${erid}</span>
            </div>
            <div class="poster">
              <img src="${poster}" alt="Poster" />
            </div>
          </div>
          <div class="content__conditions">
            <h3>${headline}</h3>
            <p class="underline">${underline}</p>
            <div class="condition-wrapper">
              <ul>${conditions.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
            ${this.getActionButton()}
            <p class="attention">${attention.join('')}</p>
          </div>
        </div>
      </div>
    `;
  }

  getActionButton() {
    const {text, action} = this.config.button;
    return action !== 'close'
      ? `<a class="prime-btn" href="${action}" target="_blank" rel="noopener noreferrer">${text}</a>`
      : `<button class="prime-btn" data-close>${text}</button>`;
  }

  showPopup = () => {
    if (!this.popup) {
      this.popup = this.createPopup();
      document.body.appendChild(this.popup);
    }
    this.popup.style.display = "flex";
    this.popup.classList.add("js-show");
    document.body.style.overflow = "hidden";

    const body = this.popup.querySelector(".content__body");
    setTimeout(() => {
      body.style.transform = "translateY(0)";
      body.style.opacity = "1";
    }, 300);
  }

  hidePopup = () => {
    if (!this.popup) return;

    const body = this.popup.querySelector(".content__body");
    body.style.transform = "translateY(-25%)";
    body.style.opacity = "0";

    setTimeout(() => {
      this.popup.remove();
      this.popup = null;
      document.body.style.overflow = "auto";
    }, 300);

    document.removeEventListener("keydown", this.onEscape);
    document.body.removeEventListener("click", this.onClickOutside);
  }

  onEscape = (e) => {
    if (e.key === "Escape") {
      this.track("close");
      this.hidePopup();
    }
  }

  onClickOutside = (e) => {
    const content = this.popup?.querySelector(".content__body");
    const trigger = document.querySelector('[href="#popup-trigger"]');
    if (
      content &&
      !content.contains(e.target) &&
      !trigger.contains(e.target)
    ) {
      this.track("close");
      this.hidePopup();
    }
  }

  bindTrigger() {
    document.addEventListener("click", e => {
      if (e.target.closest(".promo-bubble")) {
        this.track("open");
        this.showPopup();
      }
    });

    const trigger = document.querySelector('[href="#popup-trigger"]');
    if (trigger) {
      trigger.addEventListener("click", e => {
        e.preventDefault();
        this.track("open");
        this.showPopup();
      });
    }
  }

  track(eventType) {
    const args = this.config.yMetrika?.[eventType];
    if (Array.isArray(args) && typeof window.ym === "function") {
      window.ym(...args);
    }
  }
}

hostReactAppReady().then(() => {
  const promo = new PromoPopup(window.pop_up_manager);
  promo.init();
});
