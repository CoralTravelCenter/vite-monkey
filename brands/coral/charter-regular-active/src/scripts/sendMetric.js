export function sendMetric(typeFlight) {
    if (!typeFlight || typeof window.ym !== 'function') {
        return false;
    }

    window.ym(96674199, 'reachGoal', typeFlight);
    return true;
}
