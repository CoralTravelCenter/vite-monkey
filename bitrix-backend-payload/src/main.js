const first = (v) => Array.isArray(v) ? (v[0] ?? "") : (v ?? "");


const b24formService = (e) => {
  const form = e.detail?.object;
  const values = typeof form?.values === 'function' ? form.values() : null;

  console.log(values)

  const payload = {
    surname: String(first(values.CONTACT_LAST_NAME)).trim(),
    name: String(first(values.CONTACT_NAME)).trim(),
    patronymic: String(first(values.CONTACT_SECOND_NAME)).trim(),
    email: String(first(values.CONTACT_EMAIL)).trim(),
    phone: String(first(values.CONTACT_PHONE)).trim(),
    position: String(first(values.CONTACT_POST)).trim(),
    company: String(first(values.COMPANY_TITLE)).trim(),
    comment: String(first(values.DEAL_UF_CRM_1726583118)).trim(),
  };
  console.log(payload);

  fetch('endpoints/Customer/SubmitCommercialOfferForm', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((e) => {
    console.log(e)
  });
  debugger
}

window.addEventListener('b24:form:send:success', b24formService)
