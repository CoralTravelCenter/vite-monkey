export async function hostReactAppReady(
	selector = '#__next > div',
	timeout = 500
) {
	return new Promise(resolve => {
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

export function executeAfterNDays(currentDate, callback, days) {
	const local_name = 'main-popup_current_date';
	const storedDate = localStorage.getItem(local_name);

	if (!storedDate) {
		// Если дата в localStorage не существует, то записываем ее и вызываем колбэк
		localStorage.setItem(local_name, currentDate);
		callback();
		return; // Выходим из функции, так как нужно подождать первый день
	}

	const storedDateObj = new Date(storedDate);
	const targetDate = new Date(
		storedDateObj.setDate(storedDateObj.getDate() + days)
	);
	const targetDateString = targetDate.toISOString().slice(0, 10);

	if (targetDateString === currentDate) {
		// Если текущая дата равна дате, после которой нужно выполнить функцию, то выполняем ее
		callback();
		localStorage.setItem(local_name, currentDate); // Обновляем дату в localStorage
	}
}

export function stringConvert(str) {
	return str.split('.').reverse().join('-');
}

export function loadScript(url, callback) {
	const script = document.createElement('script');
	script.src = url;
	script.async = true;
	script.onload = callback;
	script.onerror = () => console.error('Ошибка загрузки скрипта');
	document.body.appendChild(script);
}
