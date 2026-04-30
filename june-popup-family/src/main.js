import {getJunePopupSegmentFromViewItemList} from './getJunePopupSegmentFromViewItemList';
import {createDataLayerWatcher} from "../../utils";
import markup from './markup.html?raw';
import './style.css'

const dataLayerWatcher = createDataLayerWatcher();

const eventData = await dataLayerWatcher.waitEvent('view_item_list');

const popupResult = getJunePopupSegmentFromViewItemList(eventData);

console.log(popupResult);

function initPopup(key) {
    const p = document.getElementById(`june-${key}-popup`);
    console.log(p)
    setTimeout(() => {
        p?.show?.();
        ym(96674199, "reachGoal", " entry-point", {
            name_stock: {
                june_26: {
                    name_point: 'pop_up_search',
                },
            },
        });
    }, 1000)
}

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