import "./popup.settings";
import {
	hostReactAppReady,
	executeAfterNDays,
	stringConvert,
	loadScript,
} from "./utils";
import { Popup } from "./Classes/Popup.class";
import "./bubble.css";
import "./popup.css";

hostReactAppReady().then(() => {
	const popup = new Popup({
		site: "sunmar",
		content_markup: true,
		launch: {
			auto: true,
			delay: 500,
			show_per_day: 1,
		},
		period: "13.07.2024",
	});
	if (pop_up_manager.launch.auto) {
		document.body.append(popup);
		setTimeout(() => {
			popup.show();
			popup.events();
		}, pop_up_manager.launch.delay);
	} else {
		const action_handler = document.querySelector(".kv-main-banner");
		action_handler.addEventListener("click", () => {
			document.body.append(popup);
			setTimeout(() => {
				popup.show();
				popup.events();
			}, pop_up_manager.launch.delay);
		});
	}
});
