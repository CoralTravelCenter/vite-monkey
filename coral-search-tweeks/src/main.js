import {ReactDomObserver} from "../../utils.js";
// import './style.scss';

const SELECTORS = {
  searchInput: '#DestinationSmartSearchContent_InputContainer-input',
  countryWrapper: '#DestinationSmartSearchContent_TreeContainer .country-wrapper .buttons'
};

function searchInputTriggerFocus(el) {
  el.focus();
}

function buttonRename(el) {
  const button = el.querySelector("button[name='Все']");
  console.log(button);
}

// === Обсерверы ===

// 1) Ставим фокус на инпут
new ReactDomObserver(SELECTORS.searchInput, {
  onAppear: el => searchInputTriggerFocus(el),
}).start();

// 1) Переименовываем кнопку
new ReactDomObserver(SELECTORS.countryWrapper, {
  onAppear: el => buttonRename(el),
}).start();
