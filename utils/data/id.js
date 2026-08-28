export function generateRandomId(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  for (let index = 0; index < length; index += 1) {
    randomId += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return randomId;
}
