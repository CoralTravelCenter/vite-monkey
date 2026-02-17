import {ReactDomObserver} from "../../utils.js";

new ReactDomObserver('div[class*="HeaderMenuBar_container__"] [href*="rannee-bronirovanie-leto"]', {
    onAppear: link => {
        link.setAttribute('onclick', "ym(96674199, 'reachGoal', 'entry-point', {name_stock: {EB_landing: {name_point: 'link_gnb'}}})")
    }
}).start();
