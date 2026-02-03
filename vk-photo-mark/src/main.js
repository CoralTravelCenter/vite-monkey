const images = document.querySelectorAll('.photos_photo_edit_row')
images.forEach(image => {
  if (image.id === 'photo_edit_row_-50203176_457274533') return;
  const button = image.querySelector('.photos_photo_edit_row_selector');
  button.click();
})
