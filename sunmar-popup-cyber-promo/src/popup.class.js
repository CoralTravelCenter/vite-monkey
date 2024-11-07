import {vimeoPopupAutoPlay} from "./utils.js";
import {Tooltip} from "./tooltip.class.js";

export class CoralPopup extends HTMLElement {
	constructor() {
		super();
		this.settings = null
		this.content = null
		this.close_btns = null
		this.addEventListener('myCustomEvent', this.handleCustomEvent.bind(this));
	}

	openConditions() {
		this.querySelector("#conditions").addEventListener("click", (e) => {
			this.querySelector(".condition-wrapper ul").classList.remove("collapse");
			e.target.classList.add("hidden");
			this.querySelector('p.attention').style.display = 'inline'
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
			return `
				<li>
					${condition}
				</li>
			`;
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
	<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
  <rect x="-0.359393" width="1.06719" height="27.8958" rx="0.533596" transform="matrix(0.707101 -0.707113 0.707101 0.707113 1.25264 1.02144)" fill="white" stroke="white" stroke-width="0.508262"/>
  <rect x="0.359393" width="1.06719" height="27.8958" rx="0.533596" transform="matrix(-0.707101 -0.707113 -0.707101 0.707113 21.7327 1.5297)" fill="white" stroke="white" stroke-width="0.508262"/>
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
		new Tooltip(this.querySelector('.img-wrapper'), {erid: this.settings.erid, vendor: 'sunmar'})
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
			vimeoPopupAutoPlay(this.querySelector('[data-vimeo]'))
		}
	}
}