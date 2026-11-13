import bage from './markup.html?raw';
import './style.css'

function forEachCancelledFlight(applyCode) {
  const heading = [...document.querySelectorAll('#reservation-detail .header > h4')]
    .find(({textContent}) => textContent.trim() === 'Детали перелета');

  const flightDetails = heading?.parentElement.nextElementSibling;
  if (!flightDetails) return;

  for (const card of flightDetails.querySelectorAll(':scope > .card-item')) {
    const status = card.querySelector('.header > .title > .cancelled-text');

    if (status?.textContent.trim() === '(Отменено)') {
      applyCode(card);
    }
  }
}

forEachCancelledFlight((card) => {
  card.setAttribute('data-flight', 'cancelled');
  if (!card.querySelector('.cancel-shild')) {
    card.querySelector('.header').insertAdjacentHTML('beforeend', bage)
  }
});
