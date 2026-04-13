import {Zuck} from 'zuck.js';
import 'zuck.js/css';
import 'zuck.js/skins/snapssenger';
import './style.css'

function ts(minutesAgo = 0) {
  return Math.floor((Date.now() - minutesAgo * 60 * 1000) / 1000);
}

const storiesData = [
  {
    id: 'hepsiburada',
    photo: 'https://picsum.photos/80/80?random=1',
    name: 'Hepsiburada',
    time: ts(5),
    items: [
      {
        id: 'hepsiburada-1',
        type: 'photo',
        length: 5,
        src: 'https://picsum.photos/720/1280?random=11',
        preview: 'https://picsum.photos/360/640?random=11',
        link: 'https://example.com',
        linkText: 'HEMEN KEŞFET',
        time: ts(5),
      },
      {
        id: 'hepsiburada-2',
        type: 'photo',
        length: 5,
        src: 'https://picsum.photos/720/1280?random=12',
        preview: 'https://picsum.photos/360/640?random=12',
        link: 'https://example.com',
        linkText: 'Открыть',
        time: ts(4),
      },
    ],
  },
  {
    id: 'visa',
    photo: 'https://picsum.photos/80/80?random=2',
    name: 'Visa',
    time: ts(4),
    items: [
      {
        id: 'visa-1',
        type: 'photo',
        length: 5,
        src: 'https://picsum.photos/720/1280?random=21',
        preview: 'https://picsum.photos/360/640?random=21',
        link: 'https://example.com',
        linkText: 'HEMEN KEŞFET',
        time: ts(4),
      },
    ],
  },
  {
    id: 'bankkart',
    photo: 'https://picsum.photos/80/80?random=3',
    name: 'Bankkart',
    time: ts(3),
    items: [
      {
        id: 'bankkart-1',
        type: 'photo',
        length: 5,
        src: 'https://picsum.photos/720/1280?random=31',
        preview: 'https://picsum.photos/360/640?random=31',
        link: 'https://example.com',
        linkText: 'Подробнее',
        time: ts(3),
      },
    ],
  },
  {
    id: 'zubizu',
    photo: 'https://picsum.photos/80/80?random=4',
    name: 'Zubizu',
    time: ts(2),
    items: [
      {
        id: 'zubizu-1',
        type: 'photo',
        length: 5,
        src: 'https://picsum.photos/720/1280?random=41',
        preview: 'https://picsum.photos/360/640?random=41',
        link: 'https://example.com',
        linkText: 'Подробнее',
        time: ts(2),
      },
    ],
  },
];
const host = document.querySelector('coral-timer');

if (host) {
  const element = document.createElement('div');
  element.id = 'stories';
  host.insertAdjacentElement('beforebegin', element);

  Zuck(element, {
    skin: 'Snapssenger',
    avatars: true,
    list: false,
    paginationArrows: true,
    autoFullScreen: false,
    cubeEffect: false,
    previousTap: true,
    backNative: false,
    localStorage: true,
    stories: storiesData,
  });
}
