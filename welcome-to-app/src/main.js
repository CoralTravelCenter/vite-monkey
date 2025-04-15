import markup from './markup.html?raw'
import './style.css'
import {ReactDomObserver} from "../../utils.js";

function triggerClick(e, mobileOS) {
  if (e.target.closest('.welcome-to-app__close')) return


  ym(215233, 'reachGoal', 'mobile_app_install', {
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

function welcomeToAppInit() {
  const placeToInsert = document.querySelector('.header-mobile')
  placeToInsert.insertAdjacentHTML('beforebegin', markup)

  const mBanner = document?.querySelector('.welcome-to-app')
  mBanner.parentElement.parentElement.style.paddingTop = '136px'
  mBanner.addEventListener('click', e => triggerClick(e, mobileOS))

  if (mBanner) ym(215233, 'reachGoal', 'mobile_app_show', {'page': location.pathname, 'store': mobileOS})

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

  const closeButton = document?.querySelector('.welcome-to-app__close')

  const observer = new ReactDomObserver('.mobile-hambuerger-menu-conainer', {
    debug: true,
    onAppear: el => {
      !mBanner.classList.contains('js-hidden') ? el.style.top = '184px' : el.style.top = '113px'
      closeButton.addEventListener('click', () => {
        el.style.top = '113px'
      })
    }
  })
  observer.start()

  closeButton?.addEventListener('click', (e) => {
    mBanner && mBanner.classList.add('js-hidden')
    mBanner.parentElement.parentElement.style.paddingTop = '65px'
    ym(215233, 'reachGoal', 'mobile_app_close', {'page': location.pathname, 'store': mobileOS})
  })
}

if (isMobile && location.pathname !== '/') welcomeToAppInit()
