export function queryParam(p, source) {
  source ||= location.href;
  let [, query] = source.split("?");
  query ||= "";
  const params_kv = query.split("&");
  const params = {};
  for (const kv of params_kv) {
    let [k, v] = kv.split("=");
    try {
      v = decodeURIComponent(v);
      v = JSON.parse(v);
    } catch {
      // Keep the decoded value when it is not JSON.
    }
    params[k] = v;
  }
  if (p) {
    return params[p];
  } else {
    return params;
  }
}

export function endpointUrl(endpoint) {
  const isLocalhost = location.hostname === "localhost";
  const host = isLocalhost
    ? "http://localhost:8010/proxy"
    : "//" + location.hostname.replace(/^(www|new)/, "b2capi");
  return `${host}${endpoint}`;
}

export function params2query(p) {
  const kv = [];
  for (let [k, v] of Object.entries(p)) {
    kv.push(
      `${k}=${encodeURIComponent(typeof v === "object" ? JSON.stringify(v) : v)}`,
    );
  }
  return kv.join("&");
}
