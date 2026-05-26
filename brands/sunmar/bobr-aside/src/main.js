import markup from './markup.html?raw'
import './style.scss'


function getPromoTextByPath(path = location.pathname) {
  switch (path) {
    case '/turkey/':
      return 'Бобро пожаловать в отпуск!';

    case '/egypt/':
      return 'Апрель – время перезагрузки!';

    case '/thailand/':
      return 'Отпуск, когда другие еще в офисе';

    case '/maldives/':
      return 'Апрель – когда цены еще не взлетели, а настроение уже да';

    case '/vietnam/pryamye-rejsy-vo-vetnam/':
      return 'Апрель – время пробуждения и новых планов!';

    case '/idei-otdykha/kak-platit-vturcii/':
      return 'Делу – время, в апреле – отпуск';

    default:
      return '';
  }
}

function getCorrectLink(path = location.pathname) {
  switch (path) {
    case '/turkey/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFGRPDgm';

    case '/egypt/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFGLwFqj';

    case '/thailand/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFGF1JiM';

    case '/maldives/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFGC3L9f';

    case '/vietnam/pryamye-rejsy-vo-vetnam/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFG95May';

    case '/idei-otdykha/kak-platit-vturcii/':
      return '/info-actions/skidki-v-aprele&erid=2W5zFG39QTb';

    default:
      return '';
  }
}

document.body.insertAdjacentHTML('beforeend', markup);
const host = document.querySelector('.bobr-wrapper');
if (host) {
  const link = host.querySelector('a');
  if (link) {
    link.setAttribute('data-label', getPromoTextByPath());
    link.href = getCorrectLink();
  }
}
const close = document.querySelector('.bobr-wrapper .close');
if (close) close.addEventListener('click', () => {
  host.style.display = 'none';
})
