import markup from './markup.html?raw'
import './style.scss'
import {hostReactAppReady, waiteSelector} from "../../utils.js";

hostReactAppReady().then(() => {
	const placeToInsert = document.querySelector('.banners-grid')
	if (placeToInsert) placeToInsert.insertAdjacentHTML('beforebegin', markup);

	waiteSelector('.b24-form-click-btn').then(() => {
		const button = document.querySelector('.b24-form-click-btn')
		button.addEventListener('click', () => {
			ym(215233, 'reachGoal', 'fill', {
				page: location.pathname,
			})
		})
	})
})
