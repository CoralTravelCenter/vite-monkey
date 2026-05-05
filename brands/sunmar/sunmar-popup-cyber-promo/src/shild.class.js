export class CoralPromoShild extends HTMLElement {
	constructor() {
		super();
	}

	render() {
		this.innerHTML = `
			<div class="icon">
			<div class="icon-text">%</div>
			</div>
			<div class="text">
			<p>Cкидка ${window.pop_up_manager_cyber.discount_size}</p>
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