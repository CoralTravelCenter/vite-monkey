import markup from './markup.html?raw';
import {insertOnce} from "../../utils.js";
import './style.scss'

const container = document.getElementById('quick-search-tab-area');

function goHome() {
  window.location.href = '/';
}

function goBack() {
  window.history.back();
}

if (container) {
  container.classList.add('js-hidden');
  insertOnce(container, 'afterend', markup);

  const actionBtn = container.parentElement?.querySelector('.basic-button-container');
  const mainContainer = container.parentElement?.querySelector('.custom-search-container__inner');
  const backBtn = mainContainer?.querySelector('.backwards');
  const goHomeBtn = mainContainer?.querySelector('.go-home');

  if (mainContainer && actionBtn) {
    mainContainer.addEventListener('click', (e) => {
      if (e.target === mainContainer) {
        actionBtn.click();
      }
    });
  }

  backBtn?.addEventListener('click', goBack);
  goHomeBtn?.addEventListener('click', goHome);
}
