import { waitForMutation } from "./observation/mutation.js";

export async function waitUntilElementsGone(config, callback) {
  const requiredSelectors = config.required || [];
  const floatingSelectors = config.floating || [];

  const hasAny = (selectors) =>
    selectors.some((sel) => document.querySelector(sel));

  const allGone = (selectors) =>
    selectors.every((sel) => !document.querySelector(sel));

  const areAllGone = () =>
    allGone(requiredSelectors) && allGone(floatingSelectors);

  // стартовая проверка
  const anyRequiredNow = hasAny(requiredSelectors);

  // если required вообще нет "сразу" — сразу идём дальше
  if (requiredSelectors.length > 0 && !anyRequiredNow) {
    callback?.();
    return;
  }

  // кейс: required есть, но уже всё исчезло (например, скрипт включили поздно)
  if (areAllGone()) {
    callback?.();
    return;
  }

  await waitForMutation(document.body, {
    timeoutMs: 0,
    predicate: areAllGone,
  });
  callback?.();
}
