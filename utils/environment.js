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

export function mediaMatcher(size, callback) {
  const mobileWidthMediaQuery = window.matchMedia(`(min-width: ${size}px)`);
  callback(mobileWidthMediaQuery.matches);
  mobileWidthMediaQuery.addEventListener("change", (e) => callback(e.matches));
}

export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
