export function watchHotelsTab(onChange) {
  const tab = document.querySelector(
    '#quick-search-tab-area [data-testid="only-hotel-tab"]'
  );

  if (!tab) return () => {
  };

  let previousActive;

  function check() {
    const active = tab.getAttribute('aria-selected') === 'true';

    if (active === previousActive) return;

    previousActive = active;
    onChange(active);
  }

  const observer = new MutationObserver(check);

  observer.observe(tab, {
    attributes: true,
    attributeFilter: ['aria-selected'],
  });

  check();

  return () => observer.disconnect();
}
