import {ReactDomObserver} from "../../utils.js";
import './style.scss';

const SELECTORS = {
	inputContainer: '#DestinationSmartSearchContent_InputContainer',
	searchInput: '#DestinationSmartSearchContent_InputContainer-input',
};

function focusSearchInput(container) {
	const input = container?.querySelector(SELECTORS.searchInput);
	input?.focus();
}

// === Обсерверы ===

new ReactDomObserver(SELECTORS.inputContainer, {
	onAppear: focusSearchInput,
}).start();

