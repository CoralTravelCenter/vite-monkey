import Cookies from 'js-cookie'
import Player from '@vimeo/player';

function timeUntilEndOfDay() {
	const now = new Date();
	const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
	return endOfDay.getTime() - now.getTime();
}

export function copyToClipboard(element) {
	try {
		navigator.clipboard.writeText(element.textContent);
		console.log('Содержимое скопировано в буфер обмена!');
	} catch (err) {
		console.error('Ошибка при копировании: ', err);
	}
}

export function isElementDefined(elementName, callback) {
	if (customElements.get(elementName) === undefined) callback()
}

export function runOncePerDay(callback) {
	const lastRunDate = Cookies.get('_lastRunDate');
	if (lastRunDate !== undefined) return; // Если куки установлены, не выполняем колбэк
	Cookies.set('_lastRunDate', new Date().toISOString(), {
		expires: timeUntilEndOfDay(),
		path: '/',
	}); // Устанавливаем куки с текущим временем, срок действия - 1 день
	callback(); // Выполняем колбэк, если куки не установлены
}

export function mediaMatcher(size, callback) {
	const mobileWidthMediaQuery = window.matchMedia(`(max-width: ${size}px)`);
	callback(mobileWidthMediaQuery.matches);
	mobileWidthMediaQuery.addEventListener('change', e => callback(e.matches));
}

export function insertOnce(element, parentElement) {
	if (parentElement && !parentElement.hasAttribute('data-inserted')) {
		parentElement.append(element)
		parentElement.setAttribute('data-inserted', 'true')
	}
}

export function vimeoPopupAutoPlay(target) {
	const vimeo = new Player(target, {
		id: target.getAttribute('data-vimeo'),
		background: 1,
		playsinline: 1,
		autopause: 0,
		title: 0,
		byline: 0,
		portrait: 0,
		autoplay: 1,
		muted: 1,
	});
	vimeo.on('play', function () {
		this.element.parentElement.classList.add('playback');
	});
	vimeo.play();
}
