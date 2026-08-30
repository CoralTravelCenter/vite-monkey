export function getNextData() {
  const configElement = document.getElementById("__NEXT_DATA__");
  return configElement
    ? JSON.parse(configElement.textContent)
    : window.__NEXT_DATA__;
}
