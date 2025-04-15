import './style.css'
import dayjs from "dayjs";

window.pop_up_manager = {
  headline: 'Скидка 3% на туры и отели',
  action: 'close', // 'close' или 'redirect'
  discount_size: '3%',
  symbol: '%',
  poster: 'https://b2ccdn.coral.ru/content/coral_popup_no_mark_04_04_25-2.webp',
  erid: '2W5zFHqDgoz',
  underline: 'Чтобы воспользоваться промокодом, введите его в поле <b>«Примечание к заказу»</b> в пункте <b>«Другое»</b> или сообщите менеджеру',
  conditions: [
    'Промокод: <strong class="strong">АПРЕЛЬ</strong> cкидка 3% на туры и отели',
    'Даты акции: с&nbsp;04.04.2025 по&nbsp;09.04.2025',
    'Даты начала отдыха: апрель&nbsp;&mdash; май 2025&nbsp;г.',
    'Направления: все, кроме России, Абхазии<br> и&nbsp;стран СНГ'
  ],
  attention: [
    '*Скидка не суммируется с действующими акциями и программой лояльности CoralBonus<br>',
    '**Скидка распространяется только на новые неоплаченные бронирования пакетных туров или отелей<br>',
    '***Скидка по промокоду действует только при самостоятельном бронировании тура на coral.ru',
  ],
  promo_start: '2025-04-14 10:00', // дата начала акции
  promo_end: '2025-04-15 19:02'    // дата окончания акции
}


class PromoPopupManager {
  constructor(config) {
    this.config = config
    this.popup = null
  }

  init() {
    if (!this.isTodayInRange()) return

    this.waitForAppReady(() => {
      this.renderBubble()
      this.bindTrigger()
    })
  }

  isTodayInRange() {
    const now = dayjs()

    const startRaw = this.config.promo_start?.trim()
    const endRaw = this.config.promo_end?.trim()

    if (!startRaw || !endRaw) return false

    const start = dayjs(startRaw, 'YYYY-MM-DD HH:mm')
    const end = dayjs(endRaw, 'YYYY-MM-DD HH:mm')

    return now.isAfter(start) && now.isBefore(end)
  }


  waitForAppReady(callback, selector = '#__next > div') {
    const check = () => {
      const el = document.querySelector(selector)
      if (el && el.getBoundingClientRect().height) callback()
      else setTimeout(check, 300)
    }
    check()
  }

  renderBubble() {
    const bubble = this.createBubble()
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const target = isMobile
      ? document.querySelector('.right-group')
      : document.querySelector('.header-logo')?.parentElement?.parentElement

    if (target && !target.querySelector('.promo-bubble')) {
      target.appendChild(bubble)
    }
  }

  createBubble() {
    const bubble = document.createElement('div')
    bubble.className = 'promo-bubble'

    const icon = document.createElement('div')
    icon.className = 'icon'

    const iconText = document.createElement('div')
    iconText.className = 'icon-text'
    iconText.textContent = this.config.symbol

    icon.appendChild(iconText)

    const textWrap = document.createElement('div')
    textWrap.className = 'text'

    const text = document.createElement('p')
    text.innerHTML = `Получите <br> скидку ${this.config.discount_size}`

    textWrap.appendChild(text)

    bubble.append(icon, textWrap)
    return bubble
  }

  createPopup() {
    const wrap = document.createElement('div')
    wrap.id = 'coral-popup'
    wrap.className = 'coral-popup'

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
							<span class="erid">Реклама. ООО «Центрбронь» Erid: ${this.config.erid}</span>
						</div>
						<div class="poster">
							<img src="${this.config.poster}" alt="Poster" />
						</div>
					</div>
					<div class="content__conditions">
						<h3>${this.config.headline}</h3>
						<p class="underline">${this.config.underline}</p>
						${this.getActionButton()}
						<div class="condition-wrapper">
							<ul>${this.config.conditions.map(c => `<li>${c}</li>`).join('')}</ul>
						</div>
						<p class="attention">${this.config.attention.join('')}</p>
					</div>
				</div>
			</div>
		`

    wrap.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => this.hidePopup())
    })

    this.popup = wrap
    return wrap
  }

  getActionButton() {
    if (this.config.action === 'close') {
      return `<button class="prime-btn" data-close>Продолжить бронирование</button>`
    }
    if (this.config.action === 'redirect') {
      return `<a class="prime-btn" href="#">Подробнее</a>`
    }
    return ''
  }

  showPopup() {
    if (!this.popup) {
      this.popup = this.createPopup()
      document.body.appendChild(this.popup)
    }
    this.popup.style.display = 'flex'
    this.popup.classList.add('js-show')
    document.body.style.overflow = 'hidden'

    const body = this.popup.querySelector('.content__body')
    setTimeout(() => {
      body.style.transform = 'translateY(0)'
      body.style.opacity = '1'
    }, 300)
  }

  hidePopup() {
    if (!this.popup) return
    const body = this.popup.querySelector('.content__body')
    body.style.transform = 'translateY(-25%)'
    body.style.opacity = '0'

    setTimeout(() => {
      this.popup.remove()
      this.popup = null
      document.body.style.overflow = 'auto'
    }, 300)
  }

  bindTrigger() {
    document.addEventListener('click', e => {
      if (e.target.closest('.promo-bubble')) this.showPopup()
    })
    const trigger = document.querySelector('[href="#popup-trigger"]')
    if (trigger) {
      trigger.addEventListener('click', e => {
        e.preventDefault()
        this.showPopup()
      })
    }
  }
}

const promo = new PromoPopupManager(window.pop_up_manager)
promo.init()
