import {MINI_PAGE_BLOCKS} from './constants.js';

function getRenderedBlocksSet() {
  if (!window.__miniPageRenderedBlocks) {
    window.__miniPageRenderedBlocks = new Set();
  }

  return window.__miniPageRenderedBlocks;
}

function renderIntoPlaceholder({selector, blockName, renderName}) {
  const target = document.querySelector(selector);
  const render = window.MiniPageBlocks?.[renderName];
  const renderedBlocks = getRenderedBlocksSet();

  if (
    !target ||
    typeof render !== 'function' ||
    target.querySelector(`[data-mini-page-block="${blockName}"]`) ||
    target.dataset.miniPageBlockRendered === blockName ||
    renderedBlocks.has(blockName)
  ) {
    return false;
  }

  const previousChildren = Array.from(target.childNodes);
  const tempContainer = document.createElement('div');

  try {
    render(tempContainer);

    if (!tempContainer.querySelector(`[data-mini-page-block="${blockName}"]`)) {
      throw new Error(`Missing rendered block marker: ${blockName}`);
    }

    target.replaceChildren(...Array.from(tempContainer.childNodes));
    target.dataset.miniPageBlockRendered = blockName;
    renderedBlocks.add(blockName);
    return true;
  } catch (error) {
    target.replaceChildren(...previousChildren);
    console.error(`[MiniPage] Failed to render block: ${blockName}`, error);
    return false;
  }
}

export function renderMiniPageBlocks() {
  MINI_PAGE_BLOCKS.forEach(renderIntoPlaceholder);
}
