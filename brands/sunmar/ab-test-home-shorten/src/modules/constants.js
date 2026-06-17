export const ROOT_SELECTOR = '[class*="BannerMainBanner_bannerMainBanner"]';
export const ORIGINAL_SLIDE_SELECTOR = '.glide__slides > .glide__slide';
export const MAX_SLIDES = 5;

export const REMOVABLE_BLOCK_SELECTORS = ['.js-timer-block', '.sunmar-bento', '.chain-hotels', '.ease-online'];
export const HOT_DEALS_SELECTOR = '.hot-deals-block';
export const HOT_DEALS_TITLE = 'Раннее бронирование 2026';
export const DIRECT_REMOVABLE_SELECTORS = ['#section-row-16', '#holiday-guide-block', '#section-row-9', '.news-slider-block'];
export const HOTELS_OF_WEEK_SWIPER_SELECTOR = '.hotels-of-the-week .swiper';
export const CUSTOM_SLIDER_CLASS = 'mini-main-slider';

export const COUNTER_ID = 215233;
export const THROTTLE_DELAY = 500;

export const SCROLL_GOALS = {
  25: 'scroll_25',
  50: 'scroll_50',
  75: 'scroll_75',
  100: 'scroll_100',
};

export const SCROLL_THRESHOLDS = Object.keys(SCROLL_GOALS).map(Number);

export const MINI_PAGE_BLOCKS = [
  {
    blockName: 'actions',
    renderName: 'renderActions',
    selector: '#actions-ab-test',
  },
  {
    blockName: 'living-hotel',
    renderName: 'renderHotels',
    selector: '#living-hotel-ab',
  },
  {
    blockName: 'bonus',
    renderName: 'renderBonus',
    selector: '#bonus-ab',
  },
];
