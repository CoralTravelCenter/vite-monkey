export function createTrigger(popup) {
  const triggerBtn = document.createElement('button');
  triggerBtn.classList.add('kapsula-popup-trigger');
  triggerBtn.innerHTML = `
   <video autoplay muted loop playsinline class="bg-video">
    <source src="https://b2ccdn.coral.ru/content/diamand-capsula.mp4" type="video/mp4">
  </video>`
  if (popup) {
    triggerBtn.addEventListener('click', () => {
      popup.show?.();
    });
  }
  return triggerBtn;
}
