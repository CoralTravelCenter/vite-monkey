import markup from './markup.html?raw'
import './style.css'
import {waiteSelector} from "../../utils.js";

waiteSelector('.cixya').then(() => {
	const placeToInsert = document.querySelectorAll('.cixya')[0]
	placeToInsert.insertAdjacentHTML('afterend', markup)

	const SEARCH_PARAMS = location.search
	const markupOnPage = document.querySelector('.lead-form-bitrix-toogle')
	if (SEARCH_PARAMS.includes('addPassenger')) {
		markupOnPage.setAttribute('data-add-passeger', '')
	}
})


