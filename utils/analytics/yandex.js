export function setYMTarget(selector, target_id, target) {
  selector.addEventListener("click", () => {
    ym(target_id, "reachGoal", target);
  });
}

export function sendYandexEventOnce(eventName, ttlHours = 2, cb) {
  const key = `ym_event_${eventName}`;
  const now = Date.now();
  const ttl = ttlHours * 60 * 60 * 1000;
  const stored = JSON.parse(localStorage.getItem(key) || "{}");
  const age = now - (stored.timestamp || 0);

  if (age < ttl) return; // TTL не истёк — ничего не делаем

  cb(); // вызываем переданную функцию
  localStorage.setItem(key, JSON.stringify({ timestamp: now }));
}
