import {isFilterCategoryMatch, isTextMatch, normalizeText} from './text.js';

const OPTION_TEXT_SELECTOR = '.ant-checkbox-label';
const SHOW_MORE_LESS_SELECTOR = '[class*="GroupCheckbox_showMoreLess__"]';
const FILTER_HIDDEN_CLASS = 'is-filter-hidden';
const FILTER_OPTION_HIDDEN_CLASS = 'is-filter-option-hidden';
const FILTER_EXPANDED_ATTR = 'data-filter-expanded';

export const getFilterText = (element) => {
  const headerTextEl = element.querySelector('.ant-collapse-header-text');
  if (headerTextEl) {
    return headerTextEl.textContent.replace(/\s+/g, ' ').trim();
  }

  const checkboxLabelEl = element.querySelector(
    '[class*="Collapse_nonCollapseBody__"] .ant-checkbox-label'
  );
  if (checkboxLabelEl) {
    return checkboxLabelEl.textContent.replace(/\s+/g, ' ').trim();
  }

  return element.textContent.replace(/\s+/g, ' ').trim();
};

export const annotateFilters = (host, filterLabels) => {
  Array.from(host.children).forEach((child) => {
    const childText = getFilterText(child);
    if (!childText) return;

    const label = filterLabels.find((item) => isFilterCategoryMatch(item, childText));
    if (!label) return;

    child.setAttribute('data-filter-name', label);
  });
};

export const getFilterBlocks = (host) =>
  Array.from(host.children).filter((child) => child.hasAttribute('data-filter-name'));

export const getFilterRootElement = (filterElement) =>
  filterElement.closest('.ant-collapse-item') ||
  filterElement.closest('[class*="Collapse_collapseItem__"]') ||
  filterElement.closest('[class*="Collapse_nonCollapseBody__"]') ||
  filterElement;

export const showElement = (element) => {
  getFilterRootElement(element).classList.remove(
    FILTER_HIDDEN_CLASS,
    FILTER_OPTION_HIDDEN_CLASS
  );
};

export const hideElement = (element) => {
  getFilterRootElement(element).classList.add(FILTER_HIDDEN_CLASS);
};

export const hideOptionElement = (element) => {
  element.classList.add(FILTER_OPTION_HIDDEN_CLASS);
};

export const getFilterOptions = (filterElement) => {
  const labels = Array.from(filterElement.querySelectorAll(OPTION_TEXT_SELECTOR));

  return labels
    .map((label) => {
      const text = normalizeText(label.textContent);
      if (!text) return null;

      const row =
        label.closest('.ant-space-item') ||
        label.closest('label') ||
        label.closest('.ant-checkbox-wrapper') ||
        label.closest('li') ||
        label.parentElement;

      if (!row || row === filterElement) return null;

      return {row, text};
    })
    .filter(Boolean);
};

export const getShowMoreLessControls = (filterElement) =>
  Array.from(filterElement.querySelectorAll(SHOW_MORE_LESS_SELECTOR));

const getExpandableControl = (filterElement) =>
  getShowMoreLessControls(filterElement).find((control) =>
    normalizeText(control.textContent).includes('показать больше')
  );

const getCollapsibleControl = (filterElement) =>
  getShowMoreLessControls(filterElement).find((control) => {
    const text = normalizeText(control.textContent);
    return text.includes('показать меньше') || text.includes('скрыть');
  });

export const expandFilterOptions = (filterElement) => {
  if (filterElement.getAttribute(FILTER_EXPANDED_ATTR) === 'true') {
    return false;
  }

  const control = getExpandableControl(filterElement);
  if (!control) return false;

  filterElement.setAttribute(FILTER_EXPANDED_ATTR, 'true');
  control.click();
  return true;
};

export const collapseFilterOptions = (filterElement) => {
  if (filterElement.getAttribute(FILTER_EXPANDED_ATTR) !== 'true') {
    return false;
  }

  const control = getCollapsibleControl(filterElement);
  if (!control) {
    filterElement.removeAttribute(FILTER_EXPANDED_ATTR);
    return false;
  }

  filterElement.removeAttribute(FILTER_EXPANDED_ATTR);
  control.click();
  return true;
};

export const applyOptionRule = (filterElement, rule) => {
  if (!rule || rule.mode === 'keep-all') {
    getFilterOptions(filterElement).forEach(({row}) => showElement(row));
    getShowMoreLessControls(filterElement).forEach((control) => showElement(control));
    return {deferred: false};
  }

  if (expandFilterOptions(filterElement)) {
    return {deferred: true};
  }

  const options = getFilterOptions(filterElement);
  const allowedValues = rule.values || [];

  getShowMoreLessControls(filterElement).forEach((control) => hideOptionElement(control));

  options.forEach(({row, text}) => {
    const matched = allowedValues.some((value) => isTextMatch(value, text));
    if (matched) {
      showElement(row);
    } else {
      hideOptionElement(row);
    }
  });

  const hasVisibleOptions = options.some(
    ({row}) => !row.classList.contains(FILTER_OPTION_HIDDEN_CLASS)
  );

  if (!hasVisibleOptions && options.length > 0) {
    hideElement(filterElement);
  }

  return {deferred: false};
};

export const resetFilterBlock = (filterElement) => {
  showElement(filterElement);
  getFilterOptions(filterElement).forEach(({row}) => showElement(row));
  getShowMoreLessControls(filterElement).forEach((control) => showElement(control));
};
