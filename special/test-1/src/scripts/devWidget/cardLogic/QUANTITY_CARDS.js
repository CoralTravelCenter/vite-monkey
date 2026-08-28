function createElements() {
    let cards = [];
    for(let i = 0; i < 100; i++) {
        cards.push(i);
    }
    return cards;
}

export const QUANTITY_ELEMENTS = createElements();