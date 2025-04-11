import markup from './markup.html?raw'
import './style.css'

function triggerClick(e, mobileOS) {
  if (e.target.closest('.welcome-to-app__close')) return

  ym(96674199, 'reachGoal', 'application', {
    page: location.pathname,
    store: mobileOS,
  })

  switch (mobileOS) {
    case 'AppStore':
      window.open(
        'https://apps.apple.com/ru/app/coral-travel-туроператор/id1497841397',
        '_blank'
      )
      break
    case 'Google':
      window.open(
        'https://play.google.com/store/apps/details?id=coraltravel.ru.coralmobile',
        '_blank'
      )
      break
    default:
      break
  }
}

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

function getMobileOS() {
  const userAgent = navigator.userAgent
  switch (true) {
    case /android/i.test(userAgent):
      return 'Google'
    case /iPad|iPhone|iPod/.test(userAgent):
      return 'AppStore'
    default:
      return 'other'
  }
}

const mobileOS = getMobileOS()

function observeElement(selector, onAppear, onDisappear) {
  let isPresent = false
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector)
    if (element && !isPresent) {
      isPresent = true
      onAppear == null ? void 0 : onAppear(element)
    } else if (!element && isPresent) {
      isPresent = false
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
  const initialElement = document.querySelector(selector)
  if (initialElement) {
    isPresent = true
    onAppear == null ? void 0 : onAppear(initialElement)
  }
  return observer
}

function welcomeToAppInit() {
  const placeToInsert = document.querySelector('.header-mobile')
  placeToInsert.insertAdjacentHTML('beforebegin', markup)

  const mBanner = document?.querySelector('.welcome-to-app')
  mBanner.parentElement.parentElement.style.paddingTop = '128px'
  mBanner.addEventListener('click', e => triggerClick(e, mobileOS))

  // Метрика появления баннера
  setTimeout(() => {
    if (mBanner) ym(96674199, 'reachGoal', 'show')
  }, 500)


  let mobileHambuergerMenuConainer
  const downloadButtonApple = document.querySelector('.apple')
  const downloadButtonGoogle = document.querySelector('.google')

  switch (mobileOS) {
    case 'Google':
      downloadButtonGoogle.classList.remove('js-hidden')
      break
    case 'AppStore':
      downloadButtonApple.classList.remove('js-hidden')
      break
  }

  observeElement('.mobile-hambuerger-menu-conainer', el => {
    mobileHambuergerMenuConainer = el
    mobileHambuergerMenuConainer.style.top = '128px'
  })

  const closeButton = document?.querySelector('.welcome-to-app__close')
  closeButton?.addEventListener('click', (e) => {
    mBanner && mBanner.classList.add('js-hidden')
    mBanner.parentElement.parentElement.style.paddingTop = '56px'
    if (mobileHambuergerMenuConainer) mobileHambuergerMenuConainer.style.top = '56px'
  })
}

if (isMobile && location.pathname !== '/') welcomeToAppInit()
