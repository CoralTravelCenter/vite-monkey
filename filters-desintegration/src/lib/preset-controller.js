import {
  applyOptionRule,
  collapseFilterOptions,
  getFilterBlocks,
  getFilterRootElement,
  resetFilterBlock,
  hideElement,
  showElement,
} from './filter-dom.js';
import {FILTERS_MAP} from '../config/filter-map.js';

const HOTEL_CATEGORY_CLASS = 'is-segment-hotel-category';
const FAMILY_BEACH_FILTER_CLASS = 'is-family-beach-filter';

export const applyPreset = (host, presets, presetId) => {
  const presetRules = presetId ? presets[presetId] || {} : null;
  const blocks = getFilterBlocks(host);
  let hasDeferredExpand = false;

  if (presetId) {
    host.setAttribute('data-active-filter-preset', presetId);
  } else {
    host.removeAttribute('data-active-filter-preset');
  }

  blocks.forEach((block) => {
    resetFilterBlock(block);
    block.classList.remove(HOTEL_CATEGORY_CLASS);
    block.classList.remove(FAMILY_BEACH_FILTER_CLASS);
    getFilterRootElement(block).classList.remove(HOTEL_CATEGORY_CLASS);
    getFilterRootElement(block).classList.remove(FAMILY_BEACH_FILTER_CLASS);
  });

  if (!presetRules) {
    blocks.forEach((block) => {
      collapseFilterOptions(block);
    });
    return;
  }

  blocks.forEach((block) => {
    const filterName = block.getAttribute('data-filter-name');
    const rule = presetRules[filterName];

    if (!rule) {
      hideElement(block);
      return;
    }

    showElement(block);

    if (
      (presetId === 'family' || presetId === 'couple') &&
      filterName === FILTERS_MAP.hotelCategory
    ) {
      block.classList.add(HOTEL_CATEGORY_CLASS);
      getFilterRootElement(block).classList.add(HOTEL_CATEGORY_CLASS);
    }

    if (presetId === 'family' && filterName === FILTERS_MAP.beach) {
      block.classList.add(FAMILY_BEACH_FILTER_CLASS);
      getFilterRootElement(block).classList.add(FAMILY_BEACH_FILTER_CLASS);
    }
    const result = applyOptionRule(block, rule);
    if (result?.deferred) {
      hasDeferredExpand = true;
    }
  });

  return {deferred: hasDeferredExpand};
};
