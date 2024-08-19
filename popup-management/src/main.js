import MicroModal from "micromodal";
import { pop_up_manager } from "@/popup.settings";
import Bubble from "../components/Bubble/Bubble";

console.log(new Bubble());

// document.body.append(new Bubble(pop_up_manager));

// document.addEventListener("b2c_domready", () => {
// 	document
// 		.querySelector(".departure-contact-phone")
// 		.parentNode.insertAdjacentHTML("");
// });

// document.body.insertAdjacentHTML(
// 	"beforeend",
// 	generatePopupMarkup(pop_up_manager),
// );

// pop_up_manager.forEach((el) => {
// 	MicroModal.init({
// 		onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
// 		onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]
// 		openTrigger: "data-custom-open", // [3]
// 		openClass: "is-open", // [5]
// 		disableScroll: true, // [6]
// 		disableFocus: false, // [7]
// 		awaitOpenAnimation: true, // [8]
// 		awaitCloseAnimation: true, // [9]
// 		debugMode: false, // [10]
// 	});
// 	MicroModal.show("modal-id");
// });
