import './main.css';

const HTML_TEMPLATE = `
	<div id="tax-shild">
	<div class="content-wrapper">
		<p>
			+ Налог <strong>3 BHD</strong>
			<span data-popower>
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
					<path
						d="M5 9.5C7.48528 9.5 9.5 7.48528 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 5.68093 0.651239 6.32653 0.921958 6.90505C0.970427 7.00863 0.98746 7.12471 0.964471 7.23673L0.649569 8.77118C0.578163 9.11913 0.882176 9.42849 1.23132 9.36317L2.83545 9.06303C2.94223 9.04305 3.05224 9.05924 3.15127 9.10392C3.71525 9.35838 4.34109 9.5 5 9.5Z"
						stroke="white"/>
					<path
						d="M3.75 3.75V3.5C3.75 2.80964 4.30964 2.25 5 2.25V2.25C5.69036 2.25 6.25 2.80964 6.25 3.5V3.66421C6.25 4.03929 6.101 4.399 5.83579 4.66421L5.58579 4.91421C5.21071 5.28929 5 5.79799 5 6.32843V6.75"
						stroke="white" stroke-linejoin="round"/>
					<path d="M5 7.25V8.25" stroke="white" stroke-linejoin="round"/>
				</svg>
			</span><br>
			за номер в сутки
		</p>
	</div>
	<div class="tooltiptext">
		<ul>
			<li>
				<strong>С 1 мая Бахрейн вводит туристический налог</strong><br> на проживание в размере 3 бахрейнских динара (~800
				₽) в сутки
				за
				номер*, независимо от звездности отеля.
			</li>
			<li>
				Налог не включен в стоимость тура и оплачивается на ресепшен отеля при заселении.
			</li>
			<li>*Стоимость налога и срок его действия устанавливается государством. Размер налога может измениться на момент
				вашего заселения в отель.
			</li>
		</ul>
	</div>
</div>
`;

(function () {
	async function docReady(callback) {
		return new Promise(function (resolve) {
			if (document.readyState === 'complete') {
				if (callback) callback();
				resolve();
			} else {
				document.addEventListener('readystatechange', function () {
					if (document.readyState === 'complete') {
						if (callback) callback();
					}
				});
				resolve();
			}
		});
	}

	docReady(() => {
		setTimeout(() => {
			if (location.pathname.includes('bahrain')) {
				const mobileWidthMediaQuery = window.matchMedia('(max-width: 768px)')

				function applyMediaLayout(isMobileSize) {
					if (isMobileSize) {
						const DOM_place_mobile = document.querySelectorAll('.target-departure');
						DOM_place_mobile.forEach(el => {
							el.parentElement.style.position = 'relative';
							el.parentElement.insertAdjacentHTML('beforeend', HTML_TEMPLATE)
						})
					} else {
						const DOM_place_desktop = document.querySelector('#hotelDetailSummaryCard > div').childNodes[0];
						if (!document.getElementById('tax-shild')) DOM_place_desktop.insertAdjacentHTML('beforeend', HTML_TEMPLATE);
					}
				}

				applyMediaLayout(mobileWidthMediaQuery.matches)
				mobileWidthMediaQuery.addEventListener('change', (e) => {
					applyMediaLayout(e.matches)
				})
			}
		});
	});
})();


