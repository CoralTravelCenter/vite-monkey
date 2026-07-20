import markupRaw from '/src/markup.html?raw';

import imgFamilyTrip from '/src/visuals/family-trip.svg';
import imgCoupleTrip from '/src/visuals/couple-trip.svg';

export const markup = markupRaw
    .replaceAll('visuals/family-trip.svg', imgFamilyTrip)
    .replaceAll('visuals/couple-trip.svg', imgCoupleTrip);