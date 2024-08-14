export class CustomMarkup {
	constructor(murkup) {
		this.markup = murkup;
	}

	render() {
		return `
		<div class="content">
  <div class="content__body">
    <button class="close" data-close></button>
    ${this.markup}
  </div>
</div>
		`;
	}
}
