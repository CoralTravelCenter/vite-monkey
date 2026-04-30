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

const resetFilterOrder = (filterElement) => {
  filterElement.style.removeProperty('order');
};

const getPresetConfig = (presets, presetId) => {
  if (!presetId) return null;

  const presetConfig = presets[presetId];
  if (!presetConfig) return null;

  if (presetConfig.filters) {
    return presetConfig;
  }

  return {
    order: Object.keys(presetConfig),
    filters: presetConfig,
  };
};

const applyPresetOrder = (blocks, order = []) => {
  const orderedFilterNames = Array.isArray(order) && order.length ? order : [];
  const orderMap = new Map(orderedFilterNames.map((name, index) => [name, index]));
  let fallbackOrder = orderedFilterNames.length;

  blocks.forEach((block) => {
    const filterName = block.getAttribute('data-filter-name');
    if (orderMap.has(filterName)) {
      block.style.order = String(orderMap.get(filterName));
      return;
    }

    block.style.order = String(fallbackOrder);
    fallbackOrder += 1;
  });
};

export const applyPreset = (host, presets, presetId) => {
  const presetConfig = getPresetConfig(presets, presetId);
  const presetRules = presetConfig?.filters || null;
  const blocks = getFilterBlocks(host);
  let hasDeferredExpand = false;

  if (presetId) {
    host.setAttribute('data-active-filter-preset', presetId);
  } else {
    host.removeAttribute('data-active-filter-preset');
  }

  blocks.forEach((block) => {
    resetFilterBlock(block);
    resetFilterOrder(block);
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

  applyPresetOrder(blocks, presetConfig?.order || Object.keys(presetRules));

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
