export function queryParam(parameter, source) {
  source ||= location.href;
  let [, query] = source.split("?");
  query ||= "";
  const pairs = query.split("&");
  const params = {};

  for (const pair of pairs) {
    let [key, value] = pair.split("=");
    try {
      value = decodeURIComponent(value);
      value = JSON.parse(value);
    } catch {
      // Keep the decoded value when it is not JSON.
    }
    params[key] = value;
  }
  return parameter ? params[parameter] : params;
}

export function endpointUrl(endpoint) {
  const isLocalhost = location.hostname === "localhost";
  const host = isLocalhost
    ? "http://localhost:8010/proxy"
    : "//" + location.hostname.replace(/^(www|new)/, "b2capi");
  return `${host}${endpoint}`;
}

export function params2query(params) {
  const pairs = [];
  for (const [key, value] of Object.entries(params)) {
    pairs.push(
      `${key}=${encodeURIComponent(
        typeof value === "object" ? JSON.stringify(value) : value,
      )}`,
    );
  }
  return pairs.join("&");
}
