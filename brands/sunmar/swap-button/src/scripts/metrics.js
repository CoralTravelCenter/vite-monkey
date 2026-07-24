const METRIKA_COUNTER_ID = 215233;
const ENTRY_POINT_GOAL_NAME = 'entry_point';

export function sendMetric(namePoint) {
    if (typeof window.ym !== 'function') {
        return;
    }

    window.ym(METRIKA_COUNTER_ID, 'reachGoal', ENTRY_POINT_GOAL_NAME, {
        name_stock: {
            eb_winter_27: {
                name_point: namePoint,
            },
        },
    });
}