function trackFlightTypeLoad() {
  const observer = new MutationObserver((mutations, obs) => {
    const charterBtn = document.querySelector('[data-testid="ptff-charter-tab-btn"]');
    const regularBtn = document.querySelector('[data-testid="ptff-regular-tab-btn"]');

    if (charterBtn && charterBtn.classList.contains('active-btn')) {
      if (typeof ym === 'function') {
        ym(96674199, 'reachGoal', 'flight_charter');
        obs.disconnect();
      }
    } else if (regularBtn && regularBtn.classList.contains('active-btn')) {
      if (typeof ym === 'function') {
        ym(96674199, 'reachGoal', 'flight_regular');
        obs.disconnect();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
}

trackFlightTypeLoad();