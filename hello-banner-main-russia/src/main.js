import './main.css'
import markup from './main.html?raw'

const placeInDOM = document.querySelector('section.benefits')
function insertOnce(position, parent, html) {
	const parentElement = parent.parentElement
	if (parentElement.hasAttribute('inserted')) return
	parent.insertAdjacentHTML(position, html)
	parentElement.setAttribute('inserted', true)
}
insertOnce('afterend', placeInDOM, markup)
