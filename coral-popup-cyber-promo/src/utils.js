import Cookies from 'js-cookie'

export function runOncePerDay(callback) {
	const today = new Date(); // Получаем текущую дату
	const midnightToday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 1,
		0,
		0,
		0,
		0
	); // Получаем дату следующего дня в 00:00

	const lastRunDate = Cookies.get('_lastRunDate');

	if (lastRunDate === undefined || new Date(lastRunDate) < midnightToday) {
		// Если куки не установлены или дата последнего запуска меньше, чем 00:00 следующего дня, запускаем код
		callback();
		Cookies.set('_lastRunDate', new Date().toISOString(), {
			expires: 1,
			path: '/',
		}); // Устанавливаем куки с текущим временем, срок действия - 1 день
	}
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

