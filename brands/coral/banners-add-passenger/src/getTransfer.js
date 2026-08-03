export function getTransfer(container) {
  if (!container) return null;

  return (
    [
      ...container.querySelectorAll(
        'div[class*="AddedServiceItem_addedServiceItem__"]',
      ),
    ].find(
      (service) =>
        service
          .querySelector('span[class*="AddedServiceItem_title___"]')
          ?.textContent?.trim() === "Трансфер",
    ) ?? null
  );
}
