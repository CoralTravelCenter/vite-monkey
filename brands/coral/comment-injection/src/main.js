(function () {
  const TEXT = 'Промокод: SALE2026';
  const SELECTOR = 'textarea[name="agencyNote"]';

  function setReactTextareaValue(element, value) {
    const prototype = Object.getPrototypeOf(element);
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

    if (setter) {
      setter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event('input', {bubbles: true}));
    element.dispatchEvent(new Event('change', {bubbles: true}));
    element.dispatchEvent(new Event('blur', {bubbles: true}));
  }

  function apply() {
    const textarea = document.querySelector(SELECTOR);
    if (!textarea) return false;

    setReactTextareaValue(textarea, TEXT);
    return true;
  }

  if (apply()) return;

  const observer = new MutationObserver(() => {
    if (apply()) observer.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
