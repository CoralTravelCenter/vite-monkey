export function getTransfer(selector) {
  let el = null
  const services = selector.closest('.list-advanced').querySelectorAll('div[class*="addedServiceItem"]');
  services.forEach(service => {
    const isCondition = service.querySelector('span[class*="AddedServiceItem_title"]').textContent === 'Трансфер';
    if (isCondition) el = service
  })
  return el
}
