export function sendMetric() {
    if (typeof window.ym === 'function') {
        window.ym(215233, "reachGoal", " entry_point", {
            name_stock: {
                NY_26_27: {
                    name_point: "GNB",
                },
            },
        });
    }
}