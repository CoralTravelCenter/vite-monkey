import './popup.settings.js';
import './style.css';
import './bubble.css';
import {CoralPopup} from "./popup.class.js";
import {isElementDefined, runOncePerDay} from "./utils.js";
import {appendOnce, mediaMatcher} from '@utils';
import {CoralPromoShild} from "./shild.class.js";


isElementDefined('cyber-promo-trigger', () => {
	customElements.define("cyber-promo-trigger", CoralPromoShild);
})


isElementDefined('coral-popup', () => {
	customElements.define("coral-popup", CoralPopup);
})

const trigger = new CoralPromoShild();
mediaMatcher(768, isMobile => {
	if (isMobile) {
		appendOnce(document.querySelector('.right-group'), trigger, 'cyber-promo-trigger')
	} else {
		appendOnce(document.querySelector('.header-logo').nextElementSibling, trigger, 'cyber-promo-trigger')
	}
}, 'max')
trigger.addEventListener('click', () => coralPopup.show())

const coralPopup = new CoralPopup();
coralPopup.triggerCustomEvent(window.pop_up_manager_cyber);
document.body.append(coralPopup)
runOncePerDay(() => {
	coralPopup.show()
})


