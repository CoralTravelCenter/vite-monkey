import markupRaw from '/src/markup.html?raw';

import imgPremiumSeclusion from '/src/visuals/premium-seclusion.svg';
import imgBeachClassic from '/src/visuals/beach-classic.svg';
import imgRomanticalDuet from '/src/visuals/romantical-duet.svg';
import imgFamilyHappiness from '/src/visuals/family-happiness.svg';

export const markup = markupRaw
    .replaceAll('visuals/premium-seclusion.svg', imgPremiumSeclusion)
    .replaceAll('visuals/beach-classic.svg', imgBeachClassic)
    .replaceAll('visuals/romantical-duet.svg', imgRomanticalDuet)
    .replaceAll('visuals/family-happiness.svg', imgFamilyHappiness);