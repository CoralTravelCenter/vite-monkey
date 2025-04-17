import './style.css'
import dayjs from "dayjs";
import Cookies from "js-cookie";
import {hostReactAppReady} from "../../utils.js";

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
  headline: "Скидка 3% на туры и отели",
  button: {
    text: "Продолжить бронирование",
    action: null
  },
  discount_size: "3%",
  symbol: "%",
  poster: "https://b2ccdn.coral.ru/content/coral_popup_no_mark_04_04_25-2.webp",
  erid: "Реклама &laquo;ООО Центрбронь&raquo; erid: 2W5zFHqDgo",
  underline: "Чтобы воспользоваться промокодом, введите его в поле <b>«Примечание к заказу»</b> в пункте <b>«Другое»</b> или сообщите менеджеру",
  conditions: [
    "Промокод: <strong class=\"strong\">АПРЕЛЬ</strong> cкидка 3% на туры и отели",
    "Даты акции: с&nbsp;04.04.2025 по&nbsp;09.04.2025",
    "Даты начала отдыха: апрель&nbsp;&mdash; май 2025&nbsp;г.",
    "Направления: все, кроме России, Абхазии<br> и&nbsp;стран СНГ"
  ],
  attention: [
    "*Скидка не суммируется с действующими акциями и программой лояльности CoralBonus<br>",
    "**Скидка распространяется только на новые неоплаченные бронирования пакетных туров или отелей<br>",
    "***Скидка по промокоду действует только при самостоятельном бронировании тура на coral.ru"
  ],
  promo_start: "2025-04-16 11:58",
  promo_end: "2025-04-16 13:20",
  autoplay: true,
  yMetrika: {
    open: null,
    close: null
  }
}


class PromoPopup {
  constructor(config) {
    this.config = config
    this.popup = null
  }

  init() {
    if (!this.isTodayInRange()) return

    this.renderBubble()
    this.bindTrigger()

    if (this.config.autoplay && this.shouldShowToday()) {
      this.showPopup()
      this.markAsShown()
    }
  }

  isTodayInRange() {
    const now = dayjs()
    const startRaw = this.config.promo_start?.trim()
    const endRaw = this.config.promo_end?.trim()

    if (!startRaw || !endRaw) return false

    const start = dayjs(startRaw, "YYYY-MM-DD HH:mm")
    const end = dayjs(endRaw, "YYYY-MM-DD HH:mm")

    return now.isAfter(start) && now.isBefore(end)
  }

  shouldShowToday() {
    const key = this.getCookieKey()
    return !Cookies.get(key)
  }

  markAsShown() {
    const key = this.getCookieKey()
    const expires = dayjs().endOf("day").toDate()
    Cookies.set(key, "1", {expires, path: "/"})
  }

  getCookieKey() {
    const id = this.config.erid || "default"
    return `popup_shown_${id}`
  }

  renderBubble() {
    const bubble = this.createBubble()
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    const target = isMobile
      ? document.querySelector(".right-group")
      : document.querySelector(".header-logo")?.parentElement?.parentElement

    if (target && !target.querySelector(".promo-bubble")) {
      target.appendChild(bubble)
    }
  }

  createBubble() {
    const bubble = document.createElement("div")
    bubble.className = "promo-bubble"

    const icon = document.createElement("div")
    icon.className = "icon"

    const iconText = document.createElement("div")
    iconText.className = "icon-text"
    iconText.textContent = this.config.symbol

    icon.appendChild(iconText)

    const textWrap = document.createElement("div")
    textWrap.className = "text"

    const text = document.createElement("p")
    text.innerHTML = `Получите <br> скидку ${this.config.discount_size}`

    textWrap.appendChild(text)

    bubble.append(icon, textWrap)
    return bubble
  }

  createPopup() {
    const wrap = document.createElement("div")
    wrap.id = "coral-popup"
    wrap.className = "coral-popup"

    const buttonHtml = this.getActionButton()

    wrap.innerHTML = `
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
							<span class="erid">${this.config.erid}</span>
						</div>
						<div class="poster">
							<img src="${this.config.poster}" alt="Poster" />
						</div>
					</div>
					<div class="content__conditions">
						<h3>${this.config.headline}</h3>
						<p class="underline">${this.config.underline}</p>
						${buttonHtml}
						<div class="condition-wrapper">
							<ul>${this.config.conditions.map(c => `<li>${c}</li>`).join("")}</ul>
						</div>
						<p class="attention">${this.config.attention.join("")}</p>
					</div>
				</div>
			</div>
		`

    // Закрытие по кнопке
    wrap.querySelectorAll("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.track("close")
        this.hidePopup()
      })
    })

    // Закрытие по Esc
    document.addEventListener("keydown", this._onEscape)

    // Клик по ссылке-кнопке
    const aBtn = wrap.querySelector("a.prime-btn")
    if (aBtn) {
      aBtn.addEventListener("click", e => {
        e.preventDefault()
        this.track("close")
        window.open(aBtn.href, "_blank")
        this.hidePopup()
      })
    }

    // Обработка клика вне
    document.body.addEventListener("click", this._onClickInsidePopup)

    this.popup = wrap
    return wrap
  }

  getActionButton() {
    if (this.config.button.action) {
      return `<a class="prime-btn" href="${this.config.button.action}" target="_blank" rel="noopener noreferrer">${this.config.button.text}</a>`
    }
    return `<button class="prime-btn" data-close>${this.config.button.text}</button>`
  }

  showPopup() {
    if (!this.popup) {
      this.popup = this.createPopup()
      document.body.appendChild(this.popup)
    }
    this.popup.style.display = "flex"
    this.popup.classList.add("js-show")
    document.body.style.overflow = "hidden"

    const body = this.popup.querySelector(".content__body")
    setTimeout(() => {
      body.style.transform = "translateY(0)"
      body.style.opacity = "1"
    }, 300)
  }

  hidePopup() {
    if (!this.popup) return

    const body = this.popup.querySelector(".content__body")
    body.style.transform = "translateY(-25%)"
    body.style.opacity = "0"

    setTimeout(() => {
      this.popup.remove()
      this.popup = null
      document.body.style.overflow = "auto"
    }, 300)

    document.removeEventListener("keydown", this._onEscape)
    document.body.removeEventListener("click", this._onClickInsidePopup)
  }

  _onEscape = (e) => {
    if (e.key === "Escape") {
      this.track("close")
      this.hidePopup()
    }
  }

  _onClickInsidePopup = (e) => {
    const content = this.popup?.querySelector(".content__body")
    if (content && !content.contains(e.target)) {
      this.track("close")
      this.hidePopup()
    }
  }

  bindTrigger() {
    document.addEventListener("click", e => {
      if (e.target.closest(".promo-bubble")) {
        this.track("open")
        this.showPopup()
      }
    })

    const trigger = document.querySelector('[href="#popup-trigger"]')
    if (trigger) {
      trigger.addEventListener("click", e => {
        e.preventDefault()
        this.track("open")
        this.showPopup()
      })
    }
  }

  track(eventType) {
    const args = this.config.yMetrika?.[eventType]

    if (
      Array.isArray(args) &&
      args.length > 0 &&
      args.every(arg => arg !== null && arg !== undefined) &&
      typeof window.ym === "function"
    ) {
      window.ym(...args)
    }
  }

}

hostReactAppReady().then(() => {
  const promo = new PromoPopup(window.pop_up_manager)
  promo.init()
})
