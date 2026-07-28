import markupRaw from '/src/markup.html?raw';

export const markup = markupRaw
    .replaceAll('visuals/mobile_version_image_start.svg', 'https://b2ccdn.sunmar.ru/content/img/actions/mobile_version_image_start.svg')
    .replaceAll('visuals/pc_version_image_start.svg', 'https://b2ccdn.sunmar.ru/content/img/actions/pc_vesrion_image_start.svg')
    .replaceAll('visuals/mobile_version_image_end.svg', 'https://b2ccdn.sunmar.ru/content/img/actions/mobile_version_image_end.svg')
    .replaceAll('visuals/pc_version_image_end.svg', 'https://b2ccdn.sunmar.ru/content/img/actions/pc_version_image_end.svg');