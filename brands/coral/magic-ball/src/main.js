import markup from './markup.html?raw'
import mobileMarkup from './markup-mobile.html?raw'
import './style.scss'

function insertOnce(target, place, markup) {
  if (target.hasAttribute('data-inserted')) return
  target.insertAdjacentHTML(place, markup)
  target.setAttribute('data-inserted', true)
}

const userAgent = navigator.userAgent;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

if (isMobile) {
  insertOnce(document.body, 'beforeend', mobileMarkup)
} else {
  insertOnce(document.body, 'beforeend', markup)
}

async function loadScript(url, cb) {
  return new Promise(resolve => {
    const script_el = document.createElement('script');
    script_el.addEventListener('load', () => {
      script_el.remove();
      typeof cb === 'function' && cb();
      resolve();
    });
    script_el.src = url;
    document.head.append(script_el);
  });
}

function getRandomElement(array) {
  if (array.length === 0) {
    return null; // Возвращаем null, если массив пустой
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

async function vimeoAutoPlay(observer_options = {}) {
  const vboxes = document.querySelectorAll('.vimeo-video-box [data-vimeo-vid]');
  if (vboxes.length) {
    await loadScript('https://player.vimeo.com/api/player.js');
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const target = entry.target;
        if (entry.isIntersecting) {
          if (!target['vimeo-player']) {
            target['vimeo-player'] = new Vimeo.Player(target, {
              id: target.dataset.vimeoVid,
              background: 1,
              playsinline: 1,
              autopause: 0,
              title: 0,
              byline: 0,
              portrait: 0,
              autoplay: 1,
              muted: 1,
            });
            target['vimeo-player'].on('play', function () {
              this.element.parentElement.classList.add('playback');
            });
          }
          target['vimeo-player'].play();
        } else {
          target['vimeo-player']?.pause();
        }
      });
    }, Object.assign({}, {threshold: .33}, observer_options));
    vboxes.forEach(box => io.observe(box));
  }
}

const blob = document.querySelector('#magic-ball')
const content = document.querySelector('#magic-ball .content')
const intro = document.querySelector('#magic-ball .intro-text')
const joke = document.querySelector('#magic-ball .joke')
const fakeCountry = document.querySelector('.fake-country')
const predskazanie = document.querySelector('.predskazanie')
const fakeText = document.querySelector('.fake-text')
const link = document.querySelector('#go-to-promopage')
const closeBtn = document.querySelector('#magic-ball .close')
const predskazanieArr = [
  {
    name: "Саркофагия",
    description: "Мумии тут живут дольше,<br> чем твои отпускные деньги."
  },
  {
    name: "Шейхбург",
    description: "Место, где роскошь - это стандарт,<br> а не опция"
  },
  {
    name: "Тукополис",
    description: "Каждая поездка - как мини-квест<br> на выживание."
  },
  {
    name: "Фотошопия",
    description: "Место, где фильтры не нужны,<br> всё уже идеально."
  },
  {
    name: "Нефтистан",
    description: "Когда бензин дешевле воды,<br> но пьют всё равно кофе."
  },
  {
    name: "Цейлонбург",
    description: "Место, где даже воздух<br> с ароматом чая."
  },
  {
    name: "Фобошная",
    description: "Место, где суп<br> - это целая философия."
  }
]


const {name, description} = getRandomElement(predskazanieArr)
fakeCountry.innerHTML = name
fakeText.innerHTML = description
vimeoAutoPlay()

closeBtn.addEventListener('click', () => {
  blob.style.display = 'none'
  ym(96674199, 'reachGoal', 'ball', {'click': 'close'})
})

content.addEventListener('click', (e) => {
  ym(96674199, 'reachGoal', 'ball', {'click': 'open'})

  blob.classList.add('no-events')
  setTimeout(() => {
    intro.classList.add('invisible')
    blob.classList.remove('darken')
  }, 200)

  setTimeout(() => {
    intro.classList.add('invisible')
    predskazanie.classList.add('visible')
    blob.classList.add('darken')
  }, 1200)

  setTimeout(() => {
    predskazanie.classList.remove('visible')
    joke.classList.add('visible')

    link.addEventListener('click', function (e) {
      e.stopPropagation()
      const yaParams = {
        "name_stock": {
          "1_april": {
            "name_point": location.pathname === '/' ? 'main_page' : 'promo_page'
          }
        }
      };
      ym(96674199, 'reachGoal', 'entry-point', yaParams);
    });
  }, 4000)
})
