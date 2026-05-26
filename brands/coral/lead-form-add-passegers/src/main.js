import scriptInner from './markup.html?raw'
import './style.css'
import {waiteSelector} from "../../utils.js";

function isMobileDevice() {
	return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function createLeadFormBlock() {
	const wrapper = document.createElement('div');
	wrapper.classList.add('lead-form-bitrix-toogle');
	wrapper.id = 'lead-form-bitrix-toggle';

	const span = document.createElement('span');
	span.textContent = 'Оформим тур за вас! 💬';

	const script = document.createElement('script');
	script.setAttribute('data-b24-form', 'click/414/m4q4ey');
	script.setAttribute('data-skip-moving', 'true');
	script.innerHTML = scriptInner;

	wrapper.append(span, script);
	return wrapper;
}

function appendOnceLeadForm(container) {
	if (!document.querySelector('#lead-form-bitrix-toggle')) {
		container.appendChild(createLeadFormBlock());
	}
}

if (isMobileDevice()) {
	waiteSelector('.ant-alert-success').then(() => {
		const container = document.querySelector('.ant-alert-success')?.parentElement?.firstChild;
		if (container) {
			appendOnceLeadForm(container);
		}

		const SEARCH_PARAMS = location.pathname;

		waiteSelector('.b24-form-click-btn').then(() => {
			const btn = document.querySelector('.b24-form-click-btn');
			if (btn) {
				btn.addEventListener('click', () => {
					ym(96674199, 'reachGoal', 'fill', {page: SEARCH_PARAMS});
				});
			}
		});
	});
}
