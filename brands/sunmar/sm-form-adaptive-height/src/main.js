// Manago part (inside iframe)
document.addEventListener('DOMContentLoaded', () => {
	const elementHeight = document.querySelector(
		'.sm-custom-subscribe'
	).offsetHeight;
	if (elementHeight !== undefined) {
		window._elementHeight = elementHeight;
		window.parent.postMessage(
			{ _h: window._elementHeight },
			'https://new.sunmar.ru'
		);
	}
});

// Sunmar part (parent window)
const SM_IRFAME = document.getElementById('salesmanagoIframe');
window.addEventListener('message', e => {
	if (e.origin === 'https://app2.salesmanago.pl') {
		const elementHeight = e.data._h;
		if (elementHeight !== undefined) {
			SM_IRFAME.style.height = `${elementHeight}px`;
		}
	}
});
