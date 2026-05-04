import {getJunePopupSegmentFromViewItemList} from './getJunePopupSegmentFromViewItemList';
import {createDataLayerWatcher} from "../../utils";
import markup from './markup.html?raw';
import './style.css'
import {createExitTracker} from "../../utils/analytics/pageLeave.js";

const dataLayerWatcher = createDataLayerWatcher();

const eventData = await dataLayerWatcher.waitEvent('view_item_list');

const popupResult = getJunePopupSegmentFromViewItemList(eventData);

function initPopup(key) {
  document.getElementById(`june-${key}-popup`);
}

createExitTracker({
  onExitIntent() {
    p?.show?.();
    ym(96674199, 'reachGoal', 'june_26_pop_up_search_show')
  }
});

if (popupResult.shouldShow) {
  await customElements.whenDefined('coral-popup');
  document.body.insertAdjacentHTML('beforeend', markup);

  const caseMap = {
    family: 'family',
    couple: 'couple',
    solo: 'solo',
  }

  switch (popupResult.segment) {
    case caseMap.family:
      initPopup(caseMap.family)
      break;

    case caseMap.couple:
      initPopup(caseMap.couple)
      break;

    case caseMap.solo:
      initPopup(caseMap.solo)
      break;

    default:
      break;
  }
}
