import {MINI_PAGE_BLOCKS} from './constants.js';

function renderIntoPlaceholder({selector, blockName, renderName}) {
  const target = document.querySelector(selector);
  const render = window.MiniPageBlocks?.[renderName];

  if (
    !target ||
    typeof render !== 'function' ||
    target.querySelector(`[data-mini-page-block="${blockName}"]`)
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
