import markup from './markup.html?raw'
import './style.css'

const host = document.querySelector('.tab-nav');

if (host) {
  host.insertAdjacentHTML('beforeend', markup);
}

const video = document.querySelector('[data-tab-video="asian-girl"]');
const parent = video?.closest('[data-link="asian-weeks"]');

if (parent && video) {
  parent.addEventListener('mouseenter', () => {
    video.pause();
  });

  parent.addEventListener('mouseleave', () => {
    video.play().catch(() => {
    });
  });
}
