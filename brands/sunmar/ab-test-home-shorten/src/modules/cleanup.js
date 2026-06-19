import {
  REMOVABLE_BLOCK_SELECTORS,
  HOT_DEALS_SELECTOR,
  HOT_DEALS_TITLE,
  DIRECT_REMOVABLE_SELECTORS,
  HOTELS_OF_WEEK_SWIPER_SELECTOR,
} from './constants.js';
import {findNearestDivInsideAntCol} from './dom.js';
import {renderMiniPageBlocks} from './blocks.js';

function removeBlocksInsideAntCol() {
  REMOVABLE_BLOCK_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(block => {
      const container = findNearestDivInsideAntCol(block);

      if (!container || container.dataset.removedByMiniPage === 'true') {
        return;
      }

      container.dataset.removedByMiniPage = 'true';
      container.remove();
    });
  });
}

function removeHotDealsBlocks() {
  document.querySelectorAll(HOT_DEALS_SELECTOR).forEach(block => {
    const hasTargetTitle = Array.from(block.querySelectorAll('*')).some(node => {
      return node.textContent?.trim() === HOT_DEALS_TITLE;
    });

    if (!hasTargetTitle || block.dataset.removedByMiniPage === 'true') {
      return;
    }

    block.dataset.removedByMiniPage = 'true';
    block.remove();
  });
}

function removeDirectBlocks() {
  DIRECT_REMOVABLE_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(block => {
      if (block.dataset.removedByMiniPage === 'true') {
        return;
      }

      block.dataset.removedByMiniPage = 'true';
      block.remove();
    });
  });
}

function fixHotelsOfWeekSwiperHeight() {
  document.querySelectorAll(HOTELS_OF_WEEK_SWIPER_SELECTOR).forEach(swiper => {
    swiper.style.setProperty('height', '350px', 'important');
  });
}

export function runStaticCleanup() {
  removeBlocksInsideAntCol();
  removeHotDealsBlocks();
  removeDirectBlocks();
  fixHotelsOfWeekSwiperHeight();
  renderMiniPageBlocks();
}

export function runSliderCleanup() {
  // Main banner is hidden via CSS only.
}

export function runCleanup() {
  runStaticCleanup();
  runSliderCleanup();
}
