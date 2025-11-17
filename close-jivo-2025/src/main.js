import dayjs from 'dayjs'
import {insertOnce, SimpleReactDomObserver} from "../../utils.js";
import closeBtnHTML from './button.html?raw';
import jivoHintHTML from './banner.html?raw';
import './styles.css'

const JivoCooldown = () => {
  const STORAGE_KEY = 'jivo_hidden_until';
  return {
    start(minutes) {
      const until = dayjs().add(minutes, 'minute').toISOString();
      localStorage.setItem(STORAGE_KEY, until);
    },
    check({onReady, onCooldown}) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        onReady && onReady();
        return;
      }

      const now = dayjs();
      const until = dayjs(raw);

      if (!until.isValid() || now.isAfter(until)) {
        onReady && onReady();
      } else {
        onCooldown && onCooldown(until.diff(now, 'minute'));
      }
    }
  }
}

function initCloseBtn(btn) {
  btn.setAttribute('mindbox-custom', 'true');
  insertOnce(btn, 'afterend', closeBtnHTML, 'close-btn')
}

function hideJivo(el) {
  el.parentElement.parentElement.style.display = 'none';
}

function showJivo(el) {
  el.parentElement.parentElement.style.display = 'block';
}

new SimpleReactDomObserver('jdiv[class^="button__"]', {
  onAppear: (btn) => {
    if (!btn) return;

    initCloseBtn(btn);

    document.body.insertAdjacentHTML('beforeend', jivoHintHTML)

    const closeBtn = document?.querySelector('.jivo-close-btn');
    const hint = document?.getElementById('jivo-hint-modal');
    if (!closeBtn && !hint) return;
    closeBtn.addEventListener('click', (e) => {
      hint.classList.add('visible')

      const dataDelay = hint?.querySelector('[data-delay="10"]');
      const dataSession = hint?.querySelector('[data-session]');
      if (!dataSession && !dataDelay) return;

      dataDelay.addEventListener('click', () => {
        hint.classList.remove('visible')
        JivoCooldown().start(10);
        JivoCooldown().check({
          onReady() {
            showJivo(btn)
          },

          onCooldown() {
            hideJivo(btn)
          }
        });
      })
    })
  }
}).start()
