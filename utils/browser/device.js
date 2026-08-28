export function getMobileOS() {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return "android";
  if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS";
  return "other";
}
