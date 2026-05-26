import './style.css';
import {ReactDomObserver} from "../../utils.js";

new ReactDomObserver('#QSDepartureContainer', {
    onAppear: function (el) {
        console.log(el);
        el.classList.add('popalsya');
    },
}).start()


