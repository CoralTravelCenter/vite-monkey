export async function sendMetric(typeFlight) {
    if (typeFlight && typeof window.ym === 'function') {
        window.ym(96674199, 'reachGoal', [typeFlight]);
    }
}