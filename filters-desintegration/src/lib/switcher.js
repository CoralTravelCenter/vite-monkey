const SWITCHER_CLASS = 'filter-presets-switcher';
const ACTIVE_CLASS = 'is-active';
const HIDDEN_CLASS = 'is-segment-hidden';

export const bindPresetSwitcher = (switcher, onToggle) => {
  if (!switcher || switcher.__boundPresetSwitcher) return;

  switcher.addEventListener('change', (event) => {
    const input = event.target.closest('input[data-preset-id]');
    if (!input) return;

    const nextPreset = input.checked ? input.dataset.presetId : null;
    onToggle(nextPreset);
  });

  switcher.__boundPresetSwitcher = true;
};

export const syncPresetSwitcherState = (
  switcher,
  activePreset,
  segmentPreset,
  hasStoredPresetOverride = false
) => {
  if (!switcher) return;

  const titleNode = switcher.querySelector(`.${SWITCHER_CLASS}__text`);
  const items = Array.from(switcher.querySelectorAll(`.${SWITCHER_CLASS}__item`));
  const hasSegmentPreset = Boolean(segmentPreset && !hasStoredPresetOverride);

  items.forEach((item) => {
    const input = item.querySelector('input[data-preset-id]');
    if (!input) return;

    const checked = input.dataset.presetId === activePreset;
    input.checked = checked;
    item.classList.toggle(ACTIVE_CLASS, checked);

    item.classList.toggle(
      HIDDEN_CLASS,
      Boolean(hasSegmentPreset && input.dataset.presetId !== segmentPreset)
    );
  });

  if (titleNode) {
    titleNode.classList.toggle(HIDDEN_CLASS, hasSegmentPreset);
  }
};
