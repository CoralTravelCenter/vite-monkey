(() => {
  const SELECTORS = {
    deleteButton: '.pv_bottom_info #pv_delete',
    date: '.rel_date[data-date]',
    container: '.pv_cont',
    photoImg: '#pv_photo img',
  };

  const check = () => {
    const result = {};

    for (const [key, selector] of Object.entries(SELECTORS)) {
      const el = document.querySelector(selector);
      result[key] = el || null;
    }

    console.group('[AUTO] selector check');
    console.table(
      Object.fromEntries(
        Object.entries(result).map(([k, v]) => [
          k,
          v ? 'FOUND' : 'NOT FOUND',
        ])
      )
    );
    console.log(result);
    console.groupEnd();

    return Object.values(result).every(Boolean);
  };

  // проверка сразу
  if (check()) return;

  // если чего-то нет — ждём через MutationObserver
  const observer = new MutationObserver(() => {
    if (check()) observer.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})()
