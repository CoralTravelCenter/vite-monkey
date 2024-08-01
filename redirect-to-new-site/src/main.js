const sessionKeyName = 'RedirectToNewState'

class Ticker extends HTMLElement {
	constructor() {
		super();
		this.setAttribute('data-state', false);
		this.shadow = this.attachShadow({mode: 'open'});
	}

	redirect() {
		const redirect_btn = this.shadow.querySelector('[data-redirect]');
		redirect_btn.addEventListener('click', (e) => {
				window.open(e.target.getAttribute('data-redirect'), '_blank');
				this.style.transform = 'translateX(-120%)';
			}
		);
	}

	hideTicker() {
		this.shadow.querySelector('[data-close]').addEventListener('click', () => {
			this.style.transform = 'translateX(-120%)';
		})
	}

	render() {
		this.shadow.innerHTML = `
                <style>
            :host {
                font-family: 'museosans', sans-serif;
                font-size: clamp(12px, 1vw, 14px);
                position: fixed;
                left: 1em;
                bottom: 1em;
                max-width: 248px;
                transition: transform 300ms ease;
                transform: translateX(-120%);
                z-index: 100;
            }

            :host .content {
                padding: 1em;
                background: #fff;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                    gap: 0.5em;
                box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
            }

            :host .content h4 {
                margin: -1em 0 0 0;
    font-size: 1.2em;
    color: #000;
    font-weight: 300;
    pointer-events: none;
    line-height: 1.2;
            }

    :host .content h4 .promo-code {
        color: #0092D0;
        font-weight: 600;
    }

            :host .content p {
                    font-size: 1em;
        margin: 0;
        line-height: 1.2;
            }

            :host button {
                cursor: pointer;
            }

            :host [data-close] {
                background: transparent;
                border: none;
                width: fit-content;
                margin: 0;
                padding: 0;
                width: 1em;
                flex-shrink: 0;
                align-self: end;
                height: 1em;
                transition: opacity 300ms ease;
            }

            :host [data-close]:hover {
                opacity: .5
            }

            :host [data-close]>svg {
                width: 100%;
                height: 100%;
            }

            :host .content .prime-btn {
                color: #FFF;
                font-size: 1em;
                font-weight: 400;
                line-height: 157.143%;
                padding: 5px 8px;
                border-radius: 4px;
                background: #0092D0;
                box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
                border: none;
                transition: background 300ms ease;
                width: fit-content;
                align-self: end;
            }

            :host .content .prime-btn:hover {
                background: #077DAD;
            }
        </style>

        <div class='content'>
            <button data-close>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M3.63319 3.63243C3.80405 3.46158 4.08105 3.46158 4.25191 3.63243L7.00076 6.38128L9.7496 3.63243C9.92046 3.46158 10.1975 3.46158 10.3683 3.63243C10.5392 3.80329 10.5392 4.0803 10.3683 4.25115L7.61948 7L10.3683 9.74885C10.5392 9.9197 10.5392 10.1967 10.3683 10.3676C10.1975 10.5384 9.92046 10.5384 9.7496 10.3676L7.00076 7.61872L4.25191 10.3676C4.08105 10.5384 3.80405 10.5384 3.63319 10.3676C3.46234 10.1967 3.46234 9.9197 3.63319 9.74885L6.38204 7L3.63319 4.25115C3.46234 4.0803 3.46234 3.80329 3.63319 3.63243Z"
                        fill="#535353" />
                </svg>
            </button>
                <h4>
                Скидка <strong>5000</strong> рублей
            </h4>
            <p>
                Мы обновили наш сайт! Теперь он стал еще удобнее и функциональнее. Бронируйте туры на new.coral.ru
            </p>
            <button class='prime-btn' data-redirect='https://new.coral.ru/'>Перейти</button>
        </div>
            `;
	}

	connectedCallback() {
		if (!this.rendered) {
			this.render();
			this.redirect();
			this.hideTicker();
			this.rendered = true;
		}
	}

}

customElements.define("redirect-ticker", Ticker);
document.body.append(new Ticker());

const ELEMENT = document.querySelector("redirect-ticker")

const executeOncePerSession = () => {
	if (sessionStorage.getItem(sessionKeyName) === 'true') {
		ELEMENT.style.transform = 'translateX(-120%)';
		return;
	}

	setTimeout(() => {
		ELEMENT.style.transform = 'translateX(0)';
	}, 1000);

	sessionStorage.setItem(sessionKeyName, 'true');
};
executeOncePerSession();



