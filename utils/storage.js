export function setLocalStorageWithExpiry(key, value, expiryInDays) {
  const expiryTime = Date.now() + expiryInDays * 86400000; // 24*60*60*1000
  const item = { value, expiry: expiryTime };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageWithExpiry(key) {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const { value, expiry } = JSON.parse(itemStr);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    console.error(`Ошибка при чтении ключа "${key}" из localStorage:`, e);
    localStorage.removeItem(key);
    return null;
  }
}

export function runOncePerSession(key = "codeExecuted") {
  if (sessionStorage.getItem(key)) {
    return false; // уже запускали в этой сессии
  }
  sessionStorage.setItem(key, "true");
  return true; // первый запуск
}
