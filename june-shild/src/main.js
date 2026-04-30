(async () => {
  const SEGMENTS = {
    family: {
      image: "https://b2ccdn.coral.ru/content/family-ribbon.webp",
      hotels: [983, 8194, 970, 465, 12880, 982, 453, 4093],
    },

    couple: {
      image: "https://b2ccdn.coral.ru/content/couple-ribbon.webp",
      hotels: [
        58809,
        10105,
        7159,
        27053,
        14524,
        46411,
        9789,
        50277,
        4239,
        8743,
        10825,
        51088,
        58201,
        73894,
      ],
    },

    solo: {
      image: "https://b2ccdn.coral.ru/content/solo-ribbon.webp",
      hotels: [899, 9809, 31036, 10083, 4256, 894, 3835, 34014, 904, 24675],
    },
  };

  const GALLERY_SELECTOR = 'div[class*="HotelDetailBlock_hotelDetailGalleryWrapper"]';
  const ACTIVE_CLASS = "june-26-ribbon-active";

  const style = document.createElement("style");

  style.textContent = `
    ${GALLERY_SELECTOR} {
      position: relative;
    }

    ${GALLERY_SELECTOR}.${ACTIVE_CLASS}::after {
      content: "";
      position: absolute;
      top: 8px;
      left: -44px;
      z-index: 10;
      width: 240px;
      height: 64px;
      background-image: var(--june-26-ribbon-url);
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      pointer-events: none;
    }
  `;

  document.head.append(style);

  const segmentName = window.Cookies.get("june_26_segment");
  const segment = SEGMENTS[segmentName];

  if (!segment) return;

  setTimeout(async () => {
    const eventData = await window.waitDataLayerEvent("view_item");
    const hotelId = Number(eventData?.ecommerce?.items?.[0]?.item_id);

    if (!segment.hotels.includes(hotelId)) return;

    const gallery = document.querySelector(GALLERY_SELECTOR);

    if (!gallery) return;

    gallery.style.setProperty("--june-26-ribbon-url", `url("${segment.image}")`);
    gallery.classList.add(ACTIVE_CLASS);
  }, 300)
})();
