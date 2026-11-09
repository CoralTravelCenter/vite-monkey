export function sendMetric() {
    if (typeof window.ym === "function") {
        window.ym(215233,'reachGoal','faq_add_passenger_group_B_click');
    }
}