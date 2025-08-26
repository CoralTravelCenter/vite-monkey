import {ReactDomObserver} from "../../utils.js";
import './style.scss';

const SELECTORS = {
  searchInput: '#DestinationSmartSearchContent_InputContainer-input',
  countryWrapper: '.country-wrapper',
  applyButton: "#DestionationSmartSearch_ApplyButton",
  container: ".destination-smart-search-container",
};

const isClickOutside = (target, container) => !target.composedPath().includes(container);

function searchInputTriggerFocus(el) {
  el?.focus();
}

function handleClickOutside(event) {
  const container = document.querySelector(SELECTORS.container);
  const trigger = document.querySelector(SELECTORS.applyButton);
  if (container && isClickOutside(event, container) && trigger) {
    trigger.click();
  }
}

function buttonRename(el) {
  setTimeout(() => {
    const btn = el?.querySelector('[name="Все"] > div');
    btn.textContent = 'Все страны';
  }, 50)
}

// === Обзерверы ===

// Ставим фокус на инпут
new ReactDomObserver(SELECTORS.searchInput, {
  onAppear: el => searchInputTriggerFocus(el),
}).start();

// Переименовываем кнопку
new ReactDomObserver(SELECTORS.countryWrapper, {
  onAppear: el => {
    buttonRename(el)
    document.body.addEventListener("click", handleClickOutside);
  }
}).start();
