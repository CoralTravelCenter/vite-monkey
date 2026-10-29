export function sendEntryPoint() {
  if (typeof window.ym !== "function") return;

  window.ym(215233, "reachGoal", "entry_point", {
    name_stock: { november_BF: { name_point: "pop_up_goryashie" } },
  });
}
