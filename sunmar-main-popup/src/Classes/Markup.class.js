export class BaseMarkup {
	generateAction() {
		if (pop_up_manager.action === "close") {
			return `<button class="prime-btn" data-close>${pop_up_manager.action_title}</button>`;
		}
		if (pop_up_manager.action.includes("redirect")) {
			return `<a class="prime-btn" href='${
				pop_up_manager.action.split(" ")[1]
			}'>${pop_up_manager.action_title}</a>`;
		}
	}

	generateConditions() {
		return pop_up_manager.conditions
			.map((condition) => {
				return `<li>${condition}</li>`;
			})
			.join("");
	}

	generateAttentions() {
		const attentions = pop_up_manager.attention
			.map((attention) => {
				return attention;
			})
			.join("");
		return `
			<p class="attention">${attentions}</p>
		`;
	}

	render() {
		return `
		<div class="content">
  <div class="content__body">
    <button class="close" data-close></button>
    <div class='img-wrapper'>
      <span class='erid'>Реклама. ООО «Оператор выгодных туров САНМАР» Erid:
        ${pop_up_manager.erid}
      </span>
      <div class='vimeo-video-box'>
        ${
			pop_up_manager.vimeo !== "" &&
			` <div data-vimeo="${pop_up_manager.vimeo}"></div>`
		}
      </div>
      <div class="poster">
        <img width='474' height='274' src="https://b2ccdn.sunmar.ru/content/img/popup-na-zapusk.jpg" />
      </div>
    </div>
    <div class="content__conditions">
      <h3>${pop_up_manager.headline}</h3>
      <h5>${pop_up_manager.second_headline}</h5>
      <p>
        ${pop_up_manager.underline}
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
	}
}
