export function runOncePerSession(key = "codeExecuted") {
  if (sessionStorage.getItem(key)) {
    return false;
  }
  sessionStorage.setItem(key, "true");
  return true;
}
