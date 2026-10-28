export function onHotelsActive(callback) {
  const isOnlyHotelPage = location.pathname.includes('/onlyhotel/');
  const tab = document.querySelector(
    '#quick-search-tab-area [data-testid="only-hotel-tab"]'
  );

  if (!isOnlyHotelPage && !tab) return () => {
  };

  let controller;
  let cleanup;
  let wasActive = false;

  function deactivate() {
    controller?.abort();
    controller = undefined;

    cleanup?.();
    cleanup = undefined;
  }

  function check() {
    const active =
      isOnlyHotelPage ||
      tab?.getAttribute('aria-selected') === 'true';

    if (active === wasActive) return;

    wasActive = active;
    deactivate();

    if (!active) return;

    const current = new AbortController();
    controller = current;

    Promise.resolve()
      .then(() => {
        if (!current.signal.aborted) {
          return callback(current.signal);
        }
      })
      .then((dispose) => {
        if (current.signal.aborted) {
          dispose?.();
        } else {
          cleanup = dispose;
        }
      })
      .catch((error) => {
        if (
          current.signal.aborted &&
          error?.name === 'AbortError'
        ) {
          return;
        }

        console.error(error);
      });
  }

  let observer;

  if (!isOnlyHotelPage) {
    observer = new MutationObserver(check);
    observer.observe(tab, {
      attributes: true,
      attributeFilter: ['aria-selected'],
    });
  }

  check();

  return () => {
    observer?.disconnect();
    deactivate();
  };
}

const stopWatching = onHotelsActive(async (signal) => {
  await customElements.whenDefined('coral-aside');

  if (signal.aborted) return;

  const template = document.createElement('template');
  template.innerHTML = markup;

  const nodes = [...template.content.childNodes];
  document.body.append(template.content);

  return () => nodes.forEach((node) => node.remove());
});
