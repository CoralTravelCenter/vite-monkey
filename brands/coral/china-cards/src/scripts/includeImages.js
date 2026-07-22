import markupRaw from '/src/markup.html?raw';

export const markup = markupRaw
    .replaceAll('visuals/family-trip.svg', 'https://b2ccdn.coral.ru/content/img/china/family-trip.svg')
    .replaceAll('visuals/couple-trip.svg', 'https://b2ccdn.coral.ru/content/img/china/couple-trip.svg');