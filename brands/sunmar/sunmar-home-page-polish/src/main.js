import './main.css';

document.addEventListener('b2c_domready', () => {
	document.querySelectorAll('.heading-tab').forEach(tab => {
		tab.addEventListener('click', e => {
			e.target.scrollIntoView(
				{ behavior: "smooth", block: "nearest", inline: "start" }
			)
		})
	})
})
