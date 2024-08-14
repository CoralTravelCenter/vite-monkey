import html from "./markup.html?raw";
import "./style.scss";

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
	document.body.insertAdjacentHTML("beforeend", html);

	const SM_IRFAME = document.getElementById("salesmanagoIframe_issue_msg");
	window.addEventListener("message", (e) => {
		if (e.origin === "https://app2.salesmanago.pl") {
			console.log(e.data);
			const elementHeight = e.data._h;
			SM_IRFAME.style.height = `${elementHeight}px`;
		}
	});
});
