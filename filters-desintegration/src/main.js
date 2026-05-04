import {debounce, reactDomObserver} from "../../utils/index.js";
import markup from './markup.html?raw';
import attentionMarkup from './attention-markup.html?raw';
import {FILTERS_MAP} from './config/filter-map.js';
import {FILTER_PRESETS} from './config/filter-presets.js';
import {annotateFilters} from './lib/filter-dom.js';
import {applyPreset} from './lib/preset-controller.js';
import {bindPresetSwitcher, syncPresetSwitcherState,} from './lib/switcher.js';
import './styles.scss';

const selector = 'div[class*="Collapse_collapseContainer__"]';
const switcherHostSelector = '.visible-on-desktop-list .ant-typography';
const filterLabels = Object.values(FILTERS_MAP);
const presetSessionKey = 'filters-desintegration-active-preset';
const disabledPresetValue = '__none__';
const segmentCookieKey = 'june_26_segment';
const metricsCounterId = 96674199;
const filtersShowGoal = 'june_26_filters_show';
const filtersActivateGoal = 'june_26_filters_activate';
const presetToggleDebounceMs = 180;
const observerSyncDebounceMs = 60;
const deferredSyncDelayMs = 120;
const debounceContext = {};
const observerSyncDebounceContext = {};
const presetAttentionTextMap = {
  family:
    'Оставили только важные фильтры, чтобы было проще найти идеальный отель для семейного отдыха.',
  couple:
    'Оставили только важные фильтры, чтобы было проще найти идеальный отель для романтического отдыха.',
  solo:
    'Оставили только важные фильтры, чтобы было проще найти идеальный отель для соло-путешествия.',
};
const defaultAttentionText =
  'Оставим только важные фильтры, чтобы было проще найти идеальный отель для вашего отдыха.';

const readCookie = (name) => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const readSegmentPreset = () => {
  const value = readCookie(segmentCookieKey);
  return value && FILTER_PRESETS[value] ? value : null;
};

const readStoredPresetState = () => {
  try {
    const value = window.sessionStorage.getItem(presetSessionKey);
    if (value === null) {
      return {
        hasOverride: false,
        presetId: null,
      };
    }

    if (value === disabledPresetValue) {
      return {
        hasOverride: true,
        presetId: null,
      };
    }

    return {
      hasOverride: Boolean(value && FILTER_PRESETS[value]),
      presetId: value && FILTER_PRESETS[value] ? value : null,
    };
  } catch {
    return {
      hasOverride: false,
      presetId: null,
    };
  }
};

const persistPreset = (presetId) => {
  try {
    if (presetId) {
      window.sessionStorage.setItem(presetSessionKey, presetId);
    } else {
      window.sessionStorage.setItem(presetSessionKey, disabledPresetValue);
    }
  } catch {
  }
};

const resolveActivePreset = (segmentPreset, storedPresetState) => {
  if (storedPresetState.hasOverride) {
    return storedPresetState.presetId;
  }

  if (segmentPreset) {
    return segmentPreset;
  }

  return null;
};

const segmentPreset = readSegmentPreset();
const storedPresetState = readStoredPresetState();
let activePreset = resolveActivePreset(segmentPreset, storedPresetState);
let filterHost = null;
let switcherHost = null;
let deferredSyncTimer = null;
let observerMutationReleaseTimer = null;
let filterHostMutationObserver = null;
let hasTrackedFiltersShow = false;
let suppressObserverChildMutations = false;
let hasPendingObserverSync = false;

const getAnalyticsSegment = (segmentPreset) => segmentPreset || 'all';

const trackGoal = (goal, payload) => {
  if (typeof window.ym !== 'function') return;

  window.ym(metricsCounterId, 'reachGoal', goal, payload);
};

const trackFiltersShow = (segmentPreset) => {
  if (hasTrackedFiltersShow) return;

  hasTrackedFiltersShow = true;
  trackGoal(filtersShowGoal, {
    filter_segment: getAnalyticsSegment(segmentPreset),
  });
};

const trackFiltersActivate = (presetId) => {
  trackGoal(filtersActivateGoal, {
    filter_segment: getAnalyticsSegment(presetId),
  });
};

const clearDeferredSync = () => {
  if (deferredSyncTimer) {
    window.clearTimeout(deferredSyncTimer);
    deferredSyncTimer = null;
  }
};

const clearObserverMutationRelease = () => {
  if (observerMutationReleaseTimer) {
    window.clearTimeout(observerMutationReleaseTimer);
    observerMutationReleaseTimer = null;
  }
};

const disconnectFilterHostMutationObserver = () => {
  if (filterHostMutationObserver) {
    filterHostMutationObserver.disconnect();
    filterHostMutationObserver = null;
  }
};

const scheduleDeferredSync = () => {
  clearDeferredSync();
  deferredSyncTimer = window.setTimeout(() => {
    deferredSyncTimer = null;
    syncUi();
  }, deferredSyncDelayMs);
};

const getCurrentState = () => {
  const segmentPreset = readSegmentPreset();
  const storedPresetState = readStoredPresetState();

  return {
    segmentPreset,
    storedPresetState,
    activePreset: resolveActivePreset(segmentPreset, storedPresetState),
  };
};

const ensurePresetSwitcher = (onToggle, state = getCurrentState()) => {
  if (!switcherHost) return null;

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
  trackFiltersShow(state.segmentPreset);
  syncPresetSwitcherState(
    switcher,
    state.activePreset,
    state.segmentPreset,
    state.storedPresetState.hasOverride
  );

  if (attention) {
    const attentionTextNode = attention.querySelector('.filter-presets-attention__text');
    if (attentionTextNode) {
      attentionTextNode.textContent =
        presetAttentionTextMap[state.activePreset] || defaultAttentionText;
    }
  }

  return switcher;
};

const applyCurrentPreset = () => {
  if (!filterHost) return;

  const result = withObserverMutationSuppression(() => {
    annotateFilters(filterHost, filterLabels);
    return applyPreset(filterHost, FILTER_PRESETS, activePreset);
  });

  if (result?.deferred) {
    scheduleDeferredSync();
  } else {
    clearDeferredSync();
  }
};

const debouncedPresetToggle = debounce((nextPreset) => {
  const nextActivePreset = activePreset === nextPreset ? null : nextPreset;
  const isUserActivation = Boolean(nextActivePreset);

  activePreset = nextActivePreset;
  persistPreset(activePreset);
  if (isUserActivation) {
    trackFiltersActivate(activePreset);
  }
  const state = getCurrentState();
  activePreset = state.activePreset;
  ensurePresetSwitcher(handlePresetToggle, state);
  applyCurrentPreset();
}, presetToggleDebounceMs);

const handlePresetToggle = (nextPreset) => {
  debouncedPresetToggle.call(debounceContext, nextPreset);
};

const syncUi = () => {
  const state = getCurrentState();
  activePreset = state.activePreset;
  ensurePresetSwitcher(handlePresetToggle, state);
  applyCurrentPreset();
};

const debouncedObserverSync = debounce(() => {
  syncUi();
}, observerSyncDebounceMs);

const scheduleSyncUi = () => {
  debouncedObserverSync.call(observerSyncDebounceContext);
};

const flushPendingObserverSync = () => {
  if (!hasPendingObserverSync) return;

  hasPendingObserverSync = false;
  scheduleSyncUi();
};

const releaseObserverMutationSuppression = () => {
  clearObserverMutationRelease();
  suppressObserverChildMutations = false;
  flushPendingObserverSync();
};

const withObserverMutationSuppression = (callback) => {
  suppressObserverChildMutations = true;
  clearObserverMutationRelease();

  try {
    return callback();
  } finally {
    observerMutationReleaseTimer = window.setTimeout(() => {
      observerMutationReleaseTimer = null;
      suppressObserverChildMutations = false;
      flushPendingObserverSync();
    }, 0);
  }
};

const handleFilterHostMutation = () => {
  if (suppressObserverChildMutations) {
    hasPendingObserverSync = true;
    return;
  }

  scheduleSyncUi();
};

const observeFilterHostMutations = (host) => {
  if (!host) return;
  if (filterHostMutationObserver && filterHost === host) return;

  disconnectFilterHostMutationObserver();

  filterHostMutationObserver = new MutationObserver(() => {
    handleFilterHostMutation();
  });

  filterHostMutationObserver.observe(host, {
    childList: true,
    subtree: true,
  });
};

const handleFilterHostAppear = (host) => {
  filterHost = host;
  observeFilterHostMutations(host);
  scheduleSyncUi();
};

const handleFilterHostDisappear = (host) => {
  if (host && filterHost && host !== filterHost) return;

  disconnectFilterHostMutationObserver();
  filterHost = null;
  hasTrackedFiltersShow = false;
  hasPendingObserverSync = false;
  clearDeferredSync();
  releaseObserverMutationSuppression();
};

const domWatcher = reactDomObserver();

domWatcher.observeSelector$(selector).subscribe(({type, element}) => {
  if (type === 'remove') {
    handleFilterHostDisappear(element);
    return;
  }

  handleFilterHostAppear(element);
});

domWatcher.observeSelector$(switcherHostSelector).subscribe(({type, element}) => {
  if (type === 'remove') {
    if (element === switcherHost) {
      switcherHost = null;
    }
    return;
  }

  switcherHost = element;
  scheduleSyncUi();
});
