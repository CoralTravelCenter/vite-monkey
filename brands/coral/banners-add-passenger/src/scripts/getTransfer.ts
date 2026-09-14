import {transferObject} from "./transferObject.ts";

export function getTransfer(container: any, transferObj: transferObject): any {
  if (!container) return null;

  return (
    [
      ...container.querySelectorAll(
        transferObj.container,
      ),
    ].find(
      (service) =>
        service
          .querySelector(transferObj.title)
          ?.textContent?.trim() === transferObj.textContentTitle,
    ) ?? null
  );
}