import {ReactDomObserver} from "../../utils.js";
import './style.scss';

const SELECTORS = {
	inputContainer: '#DestinationSmartSearchContent_InputContainer',
	treeContainer: '#DestinationSmartSearchContent_TreeContainer',
	searchInput: '#DestinationSmartSearchContent_InputContainer-input',
	applyButton: '#DestionationSmartSearch_ApplyButton',
	container: '.destination-smart-search-container',
	badgeSelector: '.badge-content > div > span',
};

let actionButtonsWrapper = null;

// === Утилиты ===

const query = selector => document.querySelector(selector);

const isClickOutside = (target, container) => !target.composedPath().includes(container);

function focusSearchInput(container) {
	const input = container?.querySelector(SELECTORS.searchInput);
	input?.focus();
}

function renameButton(container) {
	const button = container?.querySelector('button[name="Все"]');
	if (button && button.textContent !== "Все страны") {
		button.textContent = "Все страны";
	}
}

function toggleActionButtonsVisibility(treeEl) {
	actionButtonsWrapper = treeEl?.parentElement?.parentElement?.nextElementSibling;
	actionButtonsWrapper?.classList.add('js-hidden');
}

function updateActionButtonsVisibility(treeEl) {
	const badges = treeEl?.querySelectorAll(SELECTORS.badgeSelector) ?? [];
	if (!actionButtonsWrapper) return;

	actionButtonsWrapper.classList.toggle('js-hidden', badges.length === 0);
}

function handleClickOutside(event) {
	const container = query(SELECTORS.container);
	const trigger = query(SELECTORS.applyButton);

	if (container && isClickOutside(event, container) && trigger) {
		trigger.click();
	}
}

// === Обсерверы ===

new ReactDomObserver(SELECTORS.inputContainer, {
	onAppear: focusSearchInput,
}).start();

new ReactDomObserver(SELECTORS.treeContainer, {
	watchChild: true,
	onAppear: el => {
		renameButton(el);
		document.body.addEventListener('click', handleClickOutside);
	},
	onChildMutate: el => {
		renameButton(el);
		toggleActionButtonsVisibility(el);
		updateActionButtonsVisibility(el);
	},
}).start();
