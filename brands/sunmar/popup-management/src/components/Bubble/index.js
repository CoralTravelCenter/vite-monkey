import bubble_markup from "./index.html?raw";
import styles from "./index.scss?inline";

export default class Bubble extends HTMLElement {
	constructor(discount_size, modal_id) {
		super();
		this.discount_size = discount_size;
		this.attachShadow({ mode: "open" });
		this.setAttribute("data-toggle-modal", modal_id);
	}

	render() {
		this.shadowRoot.innerHTML = `<style>${styles}</style>${bubble_markup}`;
		this.shadowRoot.querySelector(
			'[data-content="discount-size"]',
		).textContent = this.discount_size;
	}

	connectedCallback() {
		if (this.rendered) {
			return;
		}
		this.rendered = true;
		this.render();
	}
}
customElements.define(`promo-bubble`, Bubble);
