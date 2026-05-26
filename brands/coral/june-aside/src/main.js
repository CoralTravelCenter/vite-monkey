import markup from './markup.html?raw';
import './style.css'

document.body.insertAdjacentHTML('beforeend', markup)

const avatars = document.querySelectorAll('.travel-story__avatar-small img');

let activeIndex = 0;

function showAvatar(index) {
  avatars.forEach((avatar, i) => {
    avatar.style.display = i === index ? 'block' : 'none';
  });
}

showAvatar(activeIndex);

setInterval(() => {
  activeIndex = (activeIndex + 1) % avatars.length;
  showAvatar(activeIndex);
}, 2000);
