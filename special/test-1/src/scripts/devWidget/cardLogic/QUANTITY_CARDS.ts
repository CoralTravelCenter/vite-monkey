function createElements(): number[] {
    let cards: number[] = [];
    for(let i = 0; i < 100; i++) {
        cards.push(i);
    }
    return cards;
}

export const QUANTITY_ELEMENTS: number[] = createElements();