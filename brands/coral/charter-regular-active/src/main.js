function trackFlightTypeLoad() {
  const intervalId = setInterval(() => {
    const charterBtn = document.querySelector('[data-testid="ptff-charter-tab-btn"]');
    const regularBtn = document.querySelector('[data-testid="ptff-regular-tab-btn"]');

    if (charterBtn && charterBtn.classList.contains('active-btn')) {
      if (typeof ym === 'function') {
        ym(96674199, 'reachGoal', 'flight_charter');
        clearInterval(intervalId);
      }
    } else if (regularBtn && regularBtn.classList.contains('active-btn')) {
      if (typeof ym === 'function') {
        ym(96674199, 'reachGoal', 'flight_regular');
        clearInterval(intervalId);
      }
    }
  }, 500);
}

trackFlightTypeLoad();