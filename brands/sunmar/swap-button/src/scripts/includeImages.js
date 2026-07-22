import markupRaw from '/src/markup.html?raw';

import imgMobileStart from '/src/visuals/mobile_version_image_start.svg';
import imgPcStart from '/src/visuals/pc_vesrion_image_start.svg';

import imgMobileEnd from '/src/visuals/mobile_version_image_end.svg';
import imgPcEnd from '/src/visuals/pc_version_image_end.svg';

export const markup = markupRaw
    .replaceAll('visuals/mobile_version_image_start.svg', imgMobileStart)
    .replaceAll('visuals/pc_vesrion_image_start.svg', imgPcStart)
    .replaceAll('visuals/mobile_version_image_end.svg', imgMobileEnd)
    .replaceAll('visuals/pc_version_image_end.svg', imgPcEnd);