import scriptInner from './markup.html?raw'
import './style.css'
import {waiteSelector} from "../../utils.js";

const block = document.createElement('div')
block.classList.add('lead-form-bitrix-toogle')

const span = document.createElement('span')
span.textContent = 'Оформим тур за вас! 💬'

const script = document.createElement('script')
script.setAttribute('data-b24-form', 'click/414/m4q4ey')
script.setAttribute('data-skip-moving', 'true')
script.innerHTML = scriptInner
block.append(span, script)


waiteSelector('.ant-alert-success').then(() => {
	const placeToInsert = document.querySelector('.ant-alert-success').parentElement.firstChild
	placeToInsert.append(block)

//	const SEARCH_PARAMS = location.pathname
//	waiteSelector('.b24-form-click-btn').then(() => {
//		const btn = document.querySelector('.b24-form-click-btn')
//		btn.addEventListener('click', () => {
//			ym('96674199', "reachGoal", {page: SEARCH_PARAMS});
//		})
//	})
})


