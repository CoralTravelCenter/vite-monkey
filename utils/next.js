export function getNextData() {
  const config_el = document.getElementById("__NEXT_DATA__");
  return config_el ? JSON.parse(config_el.textContent) : window.__NEXT_DATA__;
}
