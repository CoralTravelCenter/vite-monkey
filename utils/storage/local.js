export function setLocalStorageWithExpiry(key, value, expiryInDays) {
  const expiry = Date.now() + expiryInDays * 86400000;
  localStorage.setItem(key, JSON.stringify({ value, expiry }));
}

export function getLocalStorageWithExpiry(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, expiry } = JSON.parse(item);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (error) {
    console.error(`Ошибка при чтении ключа "${key}" из localStorage:`, error);
    localStorage.removeItem(key);
    return null;
  }
}
