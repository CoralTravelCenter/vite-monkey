export function sendMetric(namePoint) {
    if (typeof window.ym !== 'function') {
        return;
    }

    window.ym(215233, 'reachGoal', 'entry_point', {
        name_stock: {
            eb_winter_27: {
                name_point: namePoint,
            },
        },
    });
}