import markup from './markup.html?raw';
import './style.css'
import {getMobileOS, hostReactAppReady, isMobile, observeElement} from "../../utils.js";

function welcomeToAppInit() {
	const placeToInsert = document.querySelector('.header-mobile');
	placeToInsert.insertAdjacentHTML('beforebegin', markup);

	const section = document?.querySelector('.welcome-to-app');
	let mobileHambuergerMenuConainer;

	if (getMobileOS() === 'ios') {
		const downloadButtonApple = document.querySelector('.apple');
		downloadButtonApple.classList.remove('js-hidden')
	} else {
		const downloadButtonGoogle = document.querySelector('.google');
		downloadButtonGoogle.classList.remove('js-hidden')
	}

	const downloadButtons = document.querySelectorAll('.welcome-to-ap__download');
	downloadButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			ym(96674199, "reachGoal", "install", {
				page: location.pathname
			});
			if (getMobileOS() === "ios")
				window.open(
					"https://apps.apple.com/ru/app/coral-travel-туроператор/id1497841397",
					"_blank"
				);
			if (getMobileOS() === "android")
				window.open(
					"https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile",
					"_blank"
				);
		})
	})

	section.parentElement.parentElement.style.paddingTop = '188px'

	observeElement(
		'.mobile-hambuerger-menu-conainer',
		(el) => {
			mobileHambuergerMenuConainer = el
			mobileHambuergerMenuConainer.style.top = '128px'
		}
	);

	const closeButton = document?.querySelector('.welcome-to-app__close');
	if (closeButton) closeButton.addEventListener('click', () => {
		section && section.classList.add('js-hidden');
		section.parentElement.parentElement.style.paddingTop = '116px'
		mobileHambuergerMenuConainer.style.top = '106px'
	})
}

hostReactAppReady().then(() => {
	if (isMobile && location.pathname !== '/') welcomeToAppInit()
})
