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