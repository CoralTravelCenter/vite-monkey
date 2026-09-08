const goalByStep = {
  "additional-service": "faq_add_passenger_group_B_click",
  "customer": "faq_add_passenger_customer",
};

export function metric(container_faq_metric) {
  const goal = goalByStep[container_faq_metric];
  if (!goal || typeof window.ym !== "function") return false;

  window.ym(215233, "reachGoal", goal);
  return true;
}
