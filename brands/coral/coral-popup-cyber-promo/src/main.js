import './popup.settings.js';
import './style.css';
import './bubble.css';
import {CoralPopup} from "./popup.class.js";
import {insertOnce, isElementDefined, mediaMatcher, runOncePerDay} from "./utils.js";
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
		insertOnce(trigger, document.querySelector('.right-group'))
	} else {
		insertOnce(trigger, document.querySelector('.header-logo').nextElementSibling)
	}
})
trigger.addEventListener('click', () => coralPopup.show())

const coralPopup = new CoralPopup();
coralPopup.triggerCustomEvent(window.pop_up_manager_cyber);
document.body.append(coralPopup)
runOncePerDay(() => {
	coralPopup.show()
})




