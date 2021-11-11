import { getCurrentHostname } from './src/board_parser.js'

let swSpan = document.getElementById("supported_websites_span");

document.addEventListener("DOMContentLoaded", function () {
	chrome.storage.sync.get("supported_websites", ({ supported_websites }) => {
		getCurrentHostname().then((hostname) => {
			swSpan.innerHTML = "Supports " + supported_websites +
				"<br/>Current: " + hostname;
		});
	});
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: setPageBackgroundColor,
	});
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
	console.log(document.body.innerHTML)
	chrome.storage.sync.get("color", ({ color }) => {
		document.body.style.backgroundColor = color;
	});
}