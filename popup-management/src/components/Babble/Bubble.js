import bubble_markup from "./index.html?raw";

export default class Bubble extends HTMLElement {
	constructor(discount_size) {
		super();
		this.discount_size = discount_size;
		this.attachShadow({ mode: "open" });
	}

	render() {
		this.shadowRoot.innerHTML = bubble_markup;
	}

	setValue() {
		const slot = this.shadowRoot.querySelector(
			'[data-content="discount-size"]',
		);
		slot.textContent = this.discount_size;
	}

	connectedCallback() {
		if (this.rendered) {
			return;
		}
		this.rendered = true;
		this.render();
		this.setValue();
	}
}
customElements.define(`promo-bubble`, Bubble);
