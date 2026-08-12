import markup from './markup.html?raw';
import './style.css';

const ROOT_ID = 'slider-fix-root';

function init() {
  if (document.getElementById(ROOT_ID)) {
    return;
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.innerHTML = markup;

  document.body.append(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, {once: true});
} else {
  init();
}
