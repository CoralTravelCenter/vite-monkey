export function getBrand() {
  if (location.host.includes("sunmar")) return "sunmar";
  if (location.host.includes("coral")) return "coral";
  return null;
}
