export function sendMetric(namePoint: string): void {
    if (typeof (window as any).ym !== 'function') return;

    (window as any).ym(215233, "reachGoal", "entry_point", {
        name_stock: {
            november_BF: {
                name_point: namePoint,
            },
        },
    });
}