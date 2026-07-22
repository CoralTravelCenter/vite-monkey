import markupRaw from '/src/markup.html?raw';

export const markup = markupRaw
    .replaceAll('visuals/premium-seclusion.svg', 'https://b2ccdn.coral.ru/content/img/maldives/premium-seclusion.svg')
    .replaceAll('visuals/beach-classic.svg', 'https://b2ccdn.coral.ru/content/img/maldives/beach-classic.svg')
    .replaceAll('visuals/romantical-duet.svg', 'https://b2ccdn.coral.ru/content/img/maldives/romantical-duet.svg')
    .replaceAll('visuals/family-happiness.svg', 'https://b2ccdn.coral.ru/content/img/maldives/family-happiness.svg');