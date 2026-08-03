import markup from './markup.html?raw';
import './style.css';

const TARGET_HOTEL_IDS = [
  '82010', '947', '12879', '20518', '4407', '11051', '4093', '952', '988', '58628', '11754', '983',
  '50000', '125', '9965', '10796', '127', '8387', '78607', '54272', '3928', '64951',
  '35893', '2039', '50797', '1043', '9515', '47063', '25536', '33294', '9824', '7559'
];

async function waitForHostApp() {
  if (typeof window.hostReactAppReady === 'function') {
    try {
      await window.hostReactAppReady();
    } catch (e) {
      console.error(e);
    }
  }
}

async function getHotelId() {
  return new Promise((resolve) => {
    let cursor = 0;

    const timer = setInterval(() => {
      const dl = window.dataLayer || [];
      for (let i = cursor; i < dl.length; i++) {
        if (dl[i]?.event === 'view_item') {
          const id = dl[i]?.ecommerce?.items?.[0]?.item_id;
          if (id) {
            clearInterval(timer);
            return resolve(id.toString());
          }
        }
      }
      cursor = dl.length;
    }, 300);

    setTimeout(() => {
      clearInterval(timer);
      resolve(null);
    }, 10000);
  });
}

function initDevWidget() {
  const devContainer = document.getElementById('monkey-app');

  if (devContainer && !devContainer.dataset.injected) {
    devContainer.innerHTML = markup;
    devContainer.dataset.injected = 'true';
  }
}

function initProdWidget() {
  const obs = new MutationObserver(() => {
    const galleryTarget = document.querySelector('.PhotoGalleryMainCarousel_mainSwiperContainer__CDJDk');

    if (!galleryTarget) return;

    if (galleryTarget.querySelector('.custom-injected-widget-wrapper')) return;

    const badgeWrapper = document.createElement('div');
    badgeWrapper.className = 'custom-injected-widget-wrapper';
    badgeWrapper.innerHTML = markup;

    galleryTarget.insertAdjacentElement('beforeend', badgeWrapper);

    obs.disconnect();
  });

  obs.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

(async function installWidget() {
  try {
    await waitForHostApp();
  } catch (e) {
    console.error(e);
  }

  if (import.meta.env.DEV) {
    initDevWidget();
  } else {
    const currentHotelId = await getHotelId();

    if (currentHotelId && TARGET_HOTEL_IDS.includes(currentHotelId)) {
      initProdWidget();
    }
  }
})();