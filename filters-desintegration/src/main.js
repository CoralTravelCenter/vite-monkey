import {debounce, ReactDomObserver} from "../../utils.js";
import markup from './markup.html?raw';
import attentionMarkup from './attention-markup.html?raw';
import {FILTERS_MAP} from './config/filter-map.js';
import {FILTER_PRESETS} from './config/filter-presets.js';
import {annotateFilters} from './lib/filter-dom.js';
import {applyPreset} from './lib/preset-controller.js';
import {bindPresetSwitcher, syncPresetSwitcherState,} from './lib/switcher.js';
import './styles.css';

const selector = 'div[class*="Collapse_collapseContainer__"]';
const switcherHostSelector = '.visible-on-desktop-list .ant-typography';
const filterLabels = Object.values(FILTERS_MAP);
const presetSessionKey = 'filters-desintegration-active-preset';
const segmentCookieKey = 'june_26_segment';
const presetToggleDebounceMs = 180;
const debounceContext = {};
const presetAttentionTextMap = {
    family:
        'Оставили только важные фильтры, чтобы было проще найти идеальный отель для семейного отдыха.',
    couple:
        'Оставили только важные фильтры, чтобы было проще найти идеальный отель для романтического отдыха.',
    solo:
        'Оставили только важные фильтры, чтобы было проще найти идеальный отель для соло-путешествия.',
};
const defaultAttentionText =
    'Оставили только важные фильтры, чтобы было проще найти идеальный отель для вашего отдыха.';

const readCookie = (name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
};

const readSegmentPreset = () => {
    const value = readCookie(segmentCookieKey);
    return value && FILTER_PRESETS[value] ? value : null;
};

const readStoredPreset = () => {
    try {
        const value = window.sessionStorage.getItem(presetSessionKey);
        return value && FILTER_PRESETS[value] ? value : null;
    } catch {
        return null;
    }
};

const persistPreset = (presetId) => {
    try {
        if (presetId) {
            window.sessionStorage.setItem(presetSessionKey, presetId);
        } else {
            window.sessionStorage.removeItem(presetSessionKey);
        }
    } catch {
    }
};

const segmentPreset = readSegmentPreset();
const storedPreset = readStoredPreset();
let activePreset = storedPreset || segmentPreset || 'family';
let filterHost = null;
let switcherHost = null;

const ensurePresetSwitcher = (onToggle) => {
    if (!switcherHost) return null;
    const segmentPreset = readSegmentPreset();

    const switcherContainer =
        switcherHost.closest('.visible-on-desktop-list') || switcherHost.parentElement;

    if (!switcherContainer) return null;

    let switcher = switcherContainer.querySelector('[data-filter-presets-switcher]');
    if (!switcher) {
        switcherHost.insertAdjacentHTML('beforebegin', markup);
        switcher = switcherHost.previousElementSibling?.matches('[data-filter-presets-switcher]')
            ? switcherHost.previousElementSibling
            : switcherContainer.querySelector('[data-filter-presets-switcher]');
    }

    const attentionHost = document.querySelector('.hotel-list-sort-styled');
    let attention = document?.querySelector('.filter-presets-attention');
    if (attentionHost && !attention) {
        attentionHost.insertAdjacentHTML('beforebegin', attentionMarkup);
        attention = document.querySelector('.filter-presets-attention');
    }

    bindPresetSwitcher(switcher, onToggle);
    syncPresetSwitcherState(switcher, activePreset, segmentPreset);

    if (attention) {
        const attentionTextNode = attention.querySelector('.filter-presets-attention__text');
        if (attentionTextNode) {
            attentionTextNode.textContent =
                presetAttentionTextMap[activePreset] || defaultAttentionText;
        }
    }

    return switcher;
};

const applyCurrentPreset = () => {
    if (!filterHost) return;

    annotateFilters(filterHost, filterLabels);
    applyPreset(filterHost, FILTER_PRESETS, activePreset);
};

const debouncedPresetToggle = debounce((nextPreset) => {
    activePreset = activePreset === nextPreset ? null : nextPreset;
    persistPreset(activePreset);
    ensurePresetSwitcher(handlePresetToggle);
    applyCurrentPreset();
}, presetToggleDebounceMs);

const handlePresetToggle = (nextPreset) => {
    debouncedPresetToggle.call(debounceContext, nextPreset);
};

const syncUi = () => {
    ensurePresetSwitcher(handlePresetToggle);
    applyCurrentPreset();
};

new ReactDomObserver(selector, {
    watchChild: true,
    onAppear: (host) => {
        filterHost = host;
        syncUi();
    },
    onChildMutate: (host) => {
        filterHost = host;
        syncUi();
    }
}).start();

new ReactDomObserver(switcherHostSelector, {
    onAppear: (host) => {
        switcherHost = host;
        syncUi();
    }
}).start();
