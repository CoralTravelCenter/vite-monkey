export function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return "android";
  if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS";
  return "other";
}

export function getBrand() {
  if (location.host.includes("sunmar")) return "sunmar";
  if (location.host.includes("coral")) return "coral";
  return null;
}

export function mediaMatcher(size, callback, mode = "min") {
  const mobileWidthMediaQuery = window.matchMedia(`(${mode}-width: ${size}px)`);
  callback(mobileWidthMediaQuery.matches);
  mobileWidthMediaQuery.addEventListener("change", (e) => callback(e.matches));
}
