const COUNTER_ID = 96674199;
const SESSION_KEY = "faqGroupBSent";

export function sendViewMetric() {
    if (typeof window.ym !== "function" || sessionStorage.getItem(SESSION_KEY)) {
        return;
    }

    window.ym(COUNTER_ID, "reachGoal", "faq_add_passenger_group_B");
    sessionStorage.setItem(SESSION_KEY, "1");
}

export function sendMetric() {
    if (typeof window.ym === "function") {
        window.ym(COUNTER_ID, "reachGoal", "faq_add_passenger_group_B_click");
    }
}
