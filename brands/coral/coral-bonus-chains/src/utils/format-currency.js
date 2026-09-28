export function formatCurrency(value) {
  return `${Number(value).toLocaleString('ru-RU')} ₽`;
}
