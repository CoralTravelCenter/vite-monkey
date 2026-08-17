function injectData() {
    let dataMass = [];
    for(let i = 0; i < 100; i++) {
        dataMass.push(i);
    }
    return dataMass;
}

export const dataNew = injectData();