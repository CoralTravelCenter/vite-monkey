function omitEmptyArrays(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) =>
      !Array.isArray(value) || value.length > 0
    )
  );
}

function b24formService(e) {
  const form = e.detail?.object;
  const values = typeof form?.values === 'function' ? form.values() : null;

  const payload = {
    ts: Date.now(),
    iso: new Date().toISOString(),
    formId: form?.identification?.id ?? null,
    values: omitEmptyArrays(values),
    pageUrl: location.href,
    referrer: document.referrer,
  };
  console.log(payload);

  // fetch('/api/bitrix/form-success', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json'},
  //   body: JSON.stringify(payload),
  //   keepalive: true,
  //   credentials: 'include',
  // }).catch((e) => {
  //   console.log(e)
  // });
  debugger
}

window.addEventListener('b24:form:send:success', b24formService)
