import {SimpleReactDomObserver} from "../../utils.js";
import './style.css'

// ym(96674199,'reachGoal','ab_carousel_group_B')
// const host = 'a[href*="main-egypt_aprel"]';

// A - контрольная (карусель не изменилась у которых)
// new SimpleReactDomObserver(host, {
//     onAppear: () => {
//         const groupB = [...document.querySelectorAll('a[href*="ab_group=B"]')];
//         if (groupB.length > 0) {
//             groupB.forEach(el => {
//                 el.style.display = 'none';
//             })
//         }
//     }
// }).start()

//B - экспериментальная (измененная карусель)
const host = `
a[href*="main-egypt_aprel&ab_group=B"][class*="BannerLinkWrapper"]
`;
new SimpleReactDomObserver(host, {
    onAppear: (el) => {
        console.log(el)
        const targetLinks = [...document.querySelectorAll(`
              a[href*="/main/egypt/aprel/"],
              a[href*="/main/turkey/tury-v-turciyu-v-mae/"],
              a[href*="/main/vietnam/phanthiet/"]
            `)]
        if (targetLinks.length > 0) {
            targetLinks.forEach(link => {
                link.closest('.swiper-slide').setAttribute('data-group', 'B')
            })
        }
    }
}).start()