import { BaseMarkup } from "./Markup.class";
import { CustomMarkup } from "./CustomMarkup.class";
import { loadScript } from "../utils";

const CUSTOM_MARKUP = `<h1>Привет я кастомная разметка</h1>`;

export class Popup extends HTMLElement {
	constructor() {
		super();
		this.player = null;
		this.content = null;
		this.delay = pop_up_manager.launch.delay;
		this.setAttribute("data-site", pop_up_manager.site);
	}

	openConditions() {
		this.querySelector("#conditions").addEventListener("click", (e) => {
			this.querySelector(".condition-wrapper ul").classList.remove(
				"collapse",
			);
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
				this.element.parentElement.parentElement.classList.add(
					"playback",
				);
			});
		});
	}

	show() {
		this.style.display = "flex";
		this.classList.add("js-show");
		document.body.style.overflow = "hidden";
		document.body.style.paddingRight = "1rem";
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
			document.body.style.paddingRight = "0";
		}, this.delay);
	}

	events() {
		this.querySelectorAll("[data-close]").forEach((el) => {
			el.addEventListener("click", () => {
				this.hide();
				setTimeout(() => this.remove(), this.delay);
			});
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				this.hide();
				setTimeout(() => this.remove(), this.delay);
			}
		});

		document.body.addEventListener("click", (e) => {
			if (!this.querySelector(".content__body").contains(e.target)) {
				this.hide();
				setTimeout(() => this.remove(), this.delay);
			}
		});
		// if (pop_up_manager.vimeo !== "") this.vimeoInit();
	}

	render() {
		if (pop_up_manager.content_markup) {
			this.innerHTML = new BaseMarkup(pop_up_manager.site).render();
			this.content = this.querySelector(".content__body");
			this.openConditions();
			// this.vimeoInit();
		} else {
			this.innerHTML = new CustomMarkup(CUSTOM_MARKUP).render();
			this.content = this.querySelector(".content__body");
		}
	}

	connectedCallback() {
		if (this.rendered) {
			return;
		}
		this.rendered = true;
		this.render();
	}
}
customElements.define(`pop-up`, Popup);
