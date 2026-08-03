import markup from './markup.html?raw';
import './style.css';
import {insertOnce} from '@utils';

const placeToInsert = document.querySelector('.PhotoGalleryMainCarousel_mainCarousel__0d_0x').parentElement
insertOnce(placeToInsert, 'beforeend', markup, 'only-hotel-ribbon')
