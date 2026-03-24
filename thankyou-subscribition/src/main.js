import './style.scss';
// import markup from './markup.html?raw';
import {hostReactAppReady, preloadScript} from "../../utils.js";

// document.getElementById('monkey-app').innerHTML = markup;

async function vimeoAutoPlay() {
  const target = document.querySelector('[data-vimeo-vid]');
  if (!target) return;

  await preloadScript('https://player.vimeo.com/api/player.js');

  if (target['vimeo-player']) return;

  const player = new Vimeo.Player(target, {
    id: target.dataset.vimeoVid,
    background: 1,
    playsinline: 1,
    autoplay: 1,
    muted: 1,
    autopause: 0,
    title: 0,
    byline: 0,
    portrait: 0,
  });

  target['vimeo-player'] = player;

  player.on('play', function () {
    this.element.parentElement?.classList.add('playback');
  });

  player.on('pause', function () {
    this.element.parentElement?.classList.remove('playback');
  });

  player.play().catch(() => {
  });
}

(async () => {
  await hostReactAppReady()
  vimeoAutoPlay();
})()
