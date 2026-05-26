import {ClickOutside, ReactDomObserver} from "../../utils.js";
import './style.scss';

const SELECTORS = {
  searchInput: '#DestinationSmartSearchContent_InputContainer-input',
  countryWrapper: '.country-wrapper',
  applyButton: "#DestionationSmartSearch_ApplyButton",
  container: ".destination-smart-search-container",
};

function buttonRename(el) {
  setTimeout(() => {
    const btn = el?.querySelector('[name="Все"] > div');
    btn.textContent = 'Все страны';
  }, 50)
}

// === Обзерверы ===

// Ставим фокус на инпут
new ReactDomObserver(SELECTORS.searchInput, {
  onAppear: el => el.focus()
}).start();

// Переименовываем кнопку
new ReactDomObserver(SELECTORS.countryWrapper, {
  onAppear: el => buttonRename(el)
}).start();


// Работаем с поиском
new ReactDomObserver(SELECTORS.applyButton, {
  onAppear: (el) => {
    el.style.display = 'none';
    el.previousElementSibling.classList.add('js-custom-style');
    new ClickOutside(SELECTORS.container, () => {
      el.click();
    }, {
      ignore: ['#QuickSearchPackageToursArrivalLocation'],
    })
  },
}).start();
