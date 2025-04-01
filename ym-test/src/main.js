export async function hostReactAppReady(
	selector = "#__next > div",
	timeout = 500,
) {
	return new Promise((resolve) => {
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

hostReactAppReady().then(() => {
	document.querySelector('a[href*="april"]').addEventListener('click', e => {
		e.preventDefault();
		ym(96674199, 'reachGoal', 'entry-point', {
			name_stock: '1_april',
			name_point: 'promo_page'
		});
		window.location.href = '/poleznaya-informatsiya/offers/hot-offers/april/?banner_on_site=offers-april&erid=2W5zFHNWu9A';
	})
})


hostReactAppReady().then(() => {
	const target = document?.querySelector('a[href="/poleznaya-informatsiya/offers/hot-offers/april/"]')
	target.addEventListener('click', () => {
		ym(96674199, 'reachGoal', 'entry-point', {
			'name_stock': '1_april',
			'name_point': 'search'
		})
	})
})

