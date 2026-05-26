import MicroModal from "micromodal";
import { pop_up_manager } from "@/popup.settings";
import Bubble from "@/components/Bubble";
import Modal from "@/components/Modal";

async function hostReactAppReady(selector = "#__next > div", timeout = 500) {
	return new Promise((resolve) => {
		const waiter = () => {
			const host_el = document.querySelector(selector);
			if (host_el?.getBoundingClientRect().height) {
				resolve();
			} else {
				setTimeout(waiter, timeout);
			}
		};
		waiter();
	});
}

hostReactAppReady().then(() => {
	pop_up_manager.forEach((el) => {
		const {
			promo_name,
			headline,
			second_headline,
			slogan,
			action_title,
			redirect_url,
			discount_size,
			erid,
			vimeo,
			underline,
			conditions,
			attention,
			launch,
			period_start,
			period_end,
		} = el;

		document.body.append(
			new Modal(
				promo_name,
				headline,
				second_headline,
				slogan,
				action_title,
				redirect_url,
				discount_size,
				erid,
				vimeo,
				underline,
				conditions,
				attention,
				launch,
				period_start,
				period_end,
			),
		);
	});

	document
		.querySelector('a[href="/where-to-buy/"]')
		.parentNode.prepend(
			new Bubble(
				pop_up_manager[0].discount_size,
				pop_up_manager[0].promo_name,
			),
		);

	MicroModal.init({
		onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
		onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]
		openTrigger: "data-toggle-modal", // [3]
		openClass: "is-open", // [5]
		disableScroll: true, // [6]
		disableFocus: false, // [7]
		awaitOpenAnimation: true, // [8]
		awaitCloseAnimation: true, // [9]
		debugMode: false, // [10]
	});
});
