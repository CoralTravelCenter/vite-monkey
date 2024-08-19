import html from "./markup.html?raw";
import "./style.scss";

async function hostReactAppReady(selector = "#__next > div", timeout = 500) {
	return new Promise((resolve) => {
		const waiter = () => {
			const host_el = document.querySelector(selector);
			if (host_el?.getBoundingClientRect().height) {
				resolve();
			} else {
				setTimeout(waiter, timeout);
			}
		};
		waiter();
	});
}

function onSmActionClick(actions_container, sm_container) {
	actions_container.style.display = 'none';
	sm_container.style.display = 'flex';
	sm_container.style.animation = 'animateIn 300ms ease forwards';
}

function onRedirectClick(e) {
	e.preventDefault();
	const url = e.target.dataset.actionRedirect;
	window.open(url, '_blank')
}

function onMouseEnter(e) {
	e.target.style.transform = 'translateY(0)';
}

function onMouseOver(e, actions_container, sm_container) {
	actions_container.style.display = 'flex';
	sm_container.style.display = 'none';
	setTimeout(() => {
		e.target.style.transform = 'translateY(70%)';
	}, 300)
}

hostReactAppReady().then(() => {
	document.body.insertAdjacentHTML("beforeend", html);
	const PARENT_EL = document.querySelector('[data-redirect-to-old]');
	const REDIRECT_ACTION = document.querySelector('[data-action-redirect]');
	const SM_ACTION = document.querySelector('[data-action-sm]');
	const actions_container = document.querySelector('.actions-container');
	const sm_container = document.querySelector('.sm-container');

	SM_ACTION.addEventListener('click', () => onSmActionClick(actions_container, sm_container));
	REDIRECT_ACTION.addEventListener('click', onRedirectClick);
	PARENT_EL.addEventListener('mouseenter', onMouseEnter)
	PARENT_EL.addEventListener('mouseleave', e => onMouseOver(e, actions_container, sm_container))

//	window.addEventListener('message', function (event) {
//		if (event.origin === 'https://app2.salesmanago.pl' && event.data._submitted) {
//			setTimeout(() => {
//				actions_container.style.display = 'flex';
//				sm_container.style.display = 'none';
//				setTimeout(() => {
//					PARENT_EL.target.style.transform = 'translateY(70%)';
//				}, 300)
//			}, 300)
//		}
//	});
});









