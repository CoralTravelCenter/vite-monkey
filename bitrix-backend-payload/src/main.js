function b24formService(e) {
  const form = e.detail?.object;
  const values = typeof form?.values === 'function' ? form.values() : null;

  const payload = {
    ts: Date.now(),
    iso: new Date().toISOString(),
    formId: form?.identification?.id ?? null,
    values,
    pageUrl: location.href,
    referrer: document.referrer,
  };

  fetch('/api/bitrix/form-success', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'include',
  }).catch((e) => {
    console.log(e)
  });
}

window.addEventListener('b24:form:send:success', b24formService)
