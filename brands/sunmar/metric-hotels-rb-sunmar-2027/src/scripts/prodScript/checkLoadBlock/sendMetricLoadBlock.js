export async function sendMetricsLoadBlock() {
    if (typeof window.ym === 'function') {
        window.ym(215233, 'reachGoal', 'eb_winter_2027_hotel_list_show');
    }
}