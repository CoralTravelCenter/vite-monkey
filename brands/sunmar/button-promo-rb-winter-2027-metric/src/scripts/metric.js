export function sendMetric(namePointMetric) {
    if(typeof window.ym === 'function') {
        window.ym(215233, "reachGoal", "entry_point", {
            name_stock: {
                eb_winter_27: {
                    name_point: [namePointMetric],
                },
            },
        });
    }
}