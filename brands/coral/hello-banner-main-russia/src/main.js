import './main.css'
import markup from './main.html?raw'
import {insertOnce} from '@utils'

const placeInDOM = document.querySelector('section.benefits')
insertOnce(placeInDOM, 'afterend', markup, 'hello-banner-main-russia')
