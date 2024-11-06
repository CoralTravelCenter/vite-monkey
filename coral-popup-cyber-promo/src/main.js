import './popup.settings.js';
import './style.css';
import './bubble.css';
import {insertOnce, mediaMatcher, runOncePerDay} from "./utils.js";


class CoralPromoShild extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		this.innerHTML = `
			<div class="icon">
			<div class="icon-text">%</div>
			</div>
			<div class="text">
			<p>Cкидка 3%</p>
			</div>
			`;
	}

	connectedCallback() {
		if (!this.rendered) {
			this.rendered = true;
			this.render();
		}
	}
}

customElements.define("promo-trigger", CoralPromoShild);


class CoralPopup extends HTMLElement {
	constructor() {
		super();
		this.player = null;
		this.settings = null
		this.content = null
		this.close_btns = null
		this.addEventListener('myCustomEvent', this.handleCustomEvent.bind(this));
	}

	openConditions() {
		this.querySelector("#conditions").addEventListener("click", (e) => {
			this.querySelector(".condition-wrapper ul").classList.remove("collapse");
			e.target.classList.add("hidden");
		});
	}

	triggerCustomEvent(data) {
		const customEvent = new CustomEvent('myCustomEvent', {
			detail: data
		});
		this.dispatchEvent(customEvent);
	}


	handleCustomEvent(event) {
		this.settings = event.detail
	}

	generateAction() {
		switch (this.settings.action) {
			case "close":
				return `<button class="prime-btn" data-close>Продолжить бронирование</button>`;
			case "redirect":
				return `<a href='#'></a>`;
		}
	}

	generateConditions() {
		return this.settings.conditions.map((condition) => {
			return `<li>${condition}</li>`;
		}).join("");
	}

	generateAttentions() {
		const attentions = this.settings.attention.map((attention) => {
			return attention;
		}).join("");
		return `
    <p class="attention">${attentions}</p>
  `;
	}

	render() {
		this.innerHTML = `
    <div class="content">
      <div class="content__body">
      <button class="close" data-close>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.63319 3.63243C3.80405 3.46158 4.08105 3.46158 4.25191 3.63243L7.00076 6.38128L9.7496 3.63243C9.92046 3.46158 10.1975 3.46158 10.3683 3.63243C10.5392 3.80329 10.5392 4.0803 10.3683 4.25115L7.61948 7L10.3683 9.74885C10.5392 9.9197 10.5392 10.1967 10.3683 10.3676C10.1975 10.5384 9.92046 10.5384 9.7496 10.3676L7.00076 7.61872L4.25191 10.3676C4.08105 10.5384 3.80405 10.5384 3.63319 10.3676C3.46234 10.1967 3.46234 9.9197 3.63319 9.74885L6.38204 7L3.63319 4.25115C3.46234 4.0803 3.46234 3.80329 3.63319 3.63243Z" fill="#535353"></path>
    </svg>
  </button>
        <div class='img-wrapper'>
					<button class="tooltip-toggler" id="narrow-tooltip-toggler">Реклама</button>
          <div class='vimeo-video-box'>
           ${this.settings.vimeo !== "" && `<div data-vimeo="${this.settings.vimeo}"></div>`}
          </div>
          <div class="poster">
          <img width='474' height='274' src="${this.settings.poster}"/>
          </div>
        </div>
  <div class="content__conditions">
    <h3>
      ${this.settings.headline}
    </h3>
    <p class="slogan">
      ${this.settings.slogan}
    </p>
    <p style="width: 80%; margin: 0 auto">
      ${this.settings.underline}
    </p>
    ${this.generateAction()}
    <div class="condition-wrapper">
        <button id='conditions'>Подробнее об условиях акции</button>
          <ul class="collapse">
    ${this.generateConditions()}
    </ul>
    </div>

    ${this.generateAttentions()}
  </div>
</div>
</div>
  `;
		this.openConditions();
		new Tooltip(this.querySelector('.img-wrapper'), {erid: this.settings.erid, vendor: 'coral'})
	}

	show() {
		this.style.display = 'flex'
		this.classList.add('js-show')
		document.body.classList.add('js-backdrop')
		setTimeout(() => {
			this.content.style.transform = 'translateY(0)'
			this.content.style.opacity = '1'
		}, 300)
	}

	hide() {
		this.content.style.transform = 'translateY(-25%)'
		this.content.style.opacity = '0'
		setTimeout(() => {
			this.style.display = 'none'
			this.classList.remove('js-show')
			document.body.classList.remove('js-backdrop')
		}, 300)
	}

	connectedCallback() {
		if (!this.rendered) {
			this.rendered = true;
			this.render();
			this.content = this.querySelector('.content__body')
			this.close_btns = document.querySelectorAll('[data-close]')
			this.close_btns.forEach(btn => {
				btn.addEventListener('click', () => this.hide())
			})
		}
	}
}

customElements.define("coral-popup", CoralPopup);


const trigger = new CoralPromoShild();
mediaMatcher(768, isMobile => {
	if (isMobile) {
		insertOnce(trigger, document.querySelector('.right-group'))
	} else {
		insertOnce(trigger, document.querySelector('.header-logo').nextElementSibling)
	}
})
trigger.addEventListener('click', () => coralPopup.show())

const coralPopup = new CoralPopup();
coralPopup.triggerCustomEvent(window.pop_up_manager_cyber);
document.body.append(coralPopup)
runOncePerDay(() => {
	coralPopup.show()
})





