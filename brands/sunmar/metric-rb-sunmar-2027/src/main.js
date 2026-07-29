async function sendMetricButton() {
  await hostReactAppReady();

  document.addEventListener('click', event => {
    const button = event.target.closest('.hotels__button');
    if (!button) {return;}

    const block = button.closest('.hotels__item');
    if (block) {
      const hotelName = block.querySelector('.hotels__hotel-name')?.textContent.trim();
      let countryName = null;

      if (block.closest('[aria-labelledby="hotels-1-tab-turkey"]')){
        countryName = 'Turkey';
      } else if (block.closest('[aria-labelledby="hotels-1-tab-egypt"]')) {
        countryName = 'Egypt';
      } else if (block.closest('[aria-labelledby="hotels-1-tab-uae"]')) {
        countryName = 'UAE';
      }

      if (countryName && typeof ym === 'function') {
        ym(215233, "reachGoal", "eb_winter_2027_select_hotel_click", {
          country: {
            [countryName]: {
              name_hotel: `«${hotelName}»`
            }
          }
        });
      }
    }
  });
}

async function sendMetricsBlock() {
  const targetSelector = '#hotel-selection';

  const targetBlock = await new Promise(resolve => {
    const el = document.querySelector(targetSelector);
    if (el) return resolve(el);

    const rootNode = document.body || document.documentElement;

    const observer = new MutationObserver(() => {
      const node = document.querySelector(targetSelector);
      if (node) {
        observer.disconnect();
        resolve(node);
      }
    });

    observer.observe(rootNode, {
      childList: true,
      subtree: true
    });
  });

  const intObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (typeof ym === 'function') {
          ym(215233, 'reachGoal', 'eb_winter_2027_hotel_list_show');
        }
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  intObserver.observe(targetBlock);
}

sendMetricsBlock();
sendMetricButton();