import modal_markup from "./index.html?raw";
import styles from "./index.basic.scss?inline";
import styles_animation from "./index.animation.scss?inline";

export default class Modal extends HTMLElement {
	constructor(
		promo_name,
		headline,
		second_headline,
		slogan,
		action_title,
		redirect_url,
		discount_size,
		erid,
		vimeo,
		underline,
		conditions,
		attention,
		launch,
		period_start,
		period_end,
	) {
		super();
		this.modal_id = promo_name;
		this.headline = headline;
		this.second_headline = second_headline;
		this.slogan = slogan;
		this.redirect_url = redirect_url;
		this.action_title = action_title;
		this.discount_size = discount_size;
		this.erid = erid;
		this.vimeo = vimeo;
		this.underline = underline;
		this.conditions = conditions;
		this.attention = attention;
		this.launch = launch;
		this.period_start = period_start;
		this.period_end = period_end;
	}

	setValues() {
		this.querySelector(".modal").id = this.modal_id;
		this.querySelector(".modal__headline").innerHTML = this.headline;
		this.querySelector(".modal__title").innerHTML = this.second_headline;

		const action_btn = this.querySelector(".prime-btn");
		action_btn.innerHTML = this.action_title;
	}

	actions() {
		const action_btn = this.querySelector(".prime-btn");
		if (this.redirect_url !== "") {
			action_btn.addEventListener("click", () => {
				window.open(this.redirect_url, "_blank");
			});
		}
	}

	render() {
		this.innerHTML = `
			<style>${styles}</style>
			<style>${styles_animation}</style>
			${modal_markup}`;
		this.setValues();
		this.actions();
	}

	connectedCallback() {
		if (this.rendered) {
			return;
		}
		this.rendered = true;
		this.render();
	}
}
customElements.define(`coral-modal`, Modal);
