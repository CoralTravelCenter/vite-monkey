export function guardSingleton(key, init) {
    const k = `__${key}__`;
    const prev = window[k];

    if (prev?.dispose) return;

    const dispose = init();
    window[k] = {dispose};
}
