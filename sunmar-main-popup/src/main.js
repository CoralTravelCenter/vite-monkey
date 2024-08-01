import {
  hostReactAppReady,
  executeAfterNDays,
  stringConvert,
  loadScript,
} from "./utils";
import "./bubble.css";
import "./popup.css";

window.pop_up_manager = {
  headline:
    'Промокод <strong class"promo">NEW</strong> на скидку 3% от стоимости тура',
  slogan: "Испытайте наш улучшенный сайт и начните планировать свои мечты.",
  action: "close",
  action_title: "Продолжить бронирование",
  discount_size: "3%",
  erid: "LjN8KDXVa",
  vimeo: "978023164",
  underline:
    "Чтобы воспользоваться предложением, введите промокод в поле «Примечание к заказу»",
  conditions: [
    'Промокод: <strong class"promo">NEW</strong>',
    "Даты бронирования: 12.07.2024 - 21.07.2024",
    "Даты начала отдыха: любые",
    "Страны: любые",
    "Города вылета: любые",
  ],
  attention: [
    "* На бронирование отелей или полных пакетных туров<br>",
    "** Только на новые заявки, забронированные онлайн на сайте new.sunmar.ru",
  ],
  lunch: {
    mode: "auto",
    timeout: 1,
  },
  period: "13.07.2024",
};

const currentDate = new Date().toISOString().slice(0, 10);
if (pop_up_manager.period !== "") {
  if (currentDate === stringConvert(pop_up_manager.period)) {
    localStorage.removeItem("main-popup_current_date");
    return;
  }
}

class SunmarPopup extends HTMLElement {
  constructor() {
    super();
    this.player = null;
    this.content = null;
    this.delay = 300;
  }

  generateAction() {
    if (pop_up_manager.action === "close") {
      return `<button class="prime-btn" data-close>${pop_up_manager.action_title}</button>`;
    }
    if (pop_up_manager.action.includes("redirect")) {
      return `<a class="prime-btn" href='${pop_up_manager.action.split(" ")[1]
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

  openConditions() {
    this.querySelector("#conditions").addEventListener("click", (e) => {
      this.querySelector(".condition-wrapper ul").classList.remove("collapse");
      e.target.classList.add("hidden");
    });
  }

  vimeoInit() {
    loadScript("https://player.vimeo.com/api/player.js", () => {
      const target = document.querySelector("[data-vimeo]");
      this.player = new Vimeo.Player(target, {
        id: target.getAttribute("data-vimeo"),
        background: 1,
        playsinline: 1,
        autopause: 0,
        title: 0,
        byline: 0,
        portrait: 0,
        autoplay: 1,
        muted: 1,
      });
      this.player.play();
      this.player.on("play", function () {
        this.element.parentElement.parentElement.classList.add("playback");
      });
    });
  }

  show() {
    this.style.display = "flex";
    this.classList.add("js-show");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      this.content.style.transform = "translateY(0)";
      this.content.style.opacity = "1";
    }, this.delay);
  }

  hide() {
    this.content.style.transform = "translateY(-25%)";
    this.content.style.opacity = "0";
    setTimeout(() => {
      this.style.display = "none";
      this.classList.remove("js-show");
      document.body.style.overflow = "auto";
    }, this.delay);
  }

  events() {
    this.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener('click', () => {
        this.hide();
        setTimeout(() => this.remove(), this.delay);
      });
    });
  }

  render() {
    this.innerHTML = `
			<div class="content">
				<div class="content__body">
				<button class="close" data-close="">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.63319 3.63243C3.80405 3.46158 4.08105 3.46158 4.25191 3.63243L7.00076 6.38128L9.7496 3.63243C9.92046 3.46158 10.1975 3.46158 10.3683 3.63243C10.5392 3.80329 10.5392 4.0803 10.3683 4.25115L7.61948 7L10.3683 9.74885C10.5392 9.9197 10.5392 10.1967 10.3683 10.3676C10.1975 10.5384 9.92046 10.5384 9.7496 10.3676L7.00076 7.61872L4.25191 10.3676C4.08105 10.5384 3.80405 10.5384 3.63319 10.3676C3.46234 10.1967 3.46234 9.9197 3.63319 9.74885L6.38204 7L3.63319 4.25115C3.46234 4.0803 3.46234 3.80329 3.63319 3.63243Z" fill="#535353"></path>
      </svg>
    </button>
					<div class='img-wrapper'>
					<span class='erid'>Реклама. ООО «Оператор выгодных туров САНМАР» Erid: ${pop_up_manager.erid
      }</span>
            <div class='vimeo-video-box'>
             ${pop_up_manager.vimeo !== "" &&
      ` <div data-vimeo="${pop_up_manager.vimeo}"></div>`
      }
            </div>
						<div class="poster">
						<img width='474' height='274' src="https://b2ccdn.sunmar.ru/content/img/popup-na-zapusk.jpg"/>
						</div>
        	</div>
		<div class="content__conditions">
			<h3>
				${pop_up_manager.headline}
			</h3>

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
    this.content = this.querySelector(".content__body");
    this.events();
  }

  connectedCallback() {
    if (this.rendered) {
      return;
    }
    this.rendered = true;
    this.render();
    this.openConditions();
    this.vimeoInit();

    if (pop_up_manager.mode) saveCurrentDateToLocalStorage();
  }
}
customElements.define("sunmar-popup", SunmarPopup);

class PromoBubble extends HTMLElement {
  constructor() {
    super();
  }
  render() {
    this.innerHTML = `
			<div class="icon">
				<div class="icon-text-desktop">%</div>
			</div>
			<div class="text">
				<p>Получите <br> скидку ${pop_up_manager.discount_size}</p>
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
customElements.define("promo-bubble", PromoBubble);

const bubble = new PromoBubble();
const popup = new SunmarPopup();

hostReactAppReady().then(() => {
  document
    .querySelector('[href="/where-to-buy"]')
    .parentElement.prepend(bubble);

  bubble.addEventListener("click", () => {
    document.body.append(popup);
    popup.show();
  });

  if (pop_up_manager.lunch.mode === "auto") {
    executeAfterNDays(
      currentDate,
      () => {
        document.body.append(popup);
        popup.show();
      },
      pop_up_manager.lunch.timeout,
    );
  }
});
