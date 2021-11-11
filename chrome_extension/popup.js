import { getCurrentHostname, getBoard } from './src/board_parser.js'

let swSpan = document.getElementById("supported_websites_span");
let output = document.getElementById("output");

document.addEventListener("DOMContentLoaded", function () {
	chrome.storage.sync.get("supported_websites", ({ supported_websites }) => {
		getCurrentHostname().then((hostname) => {
			swSpan.innerHTML = "Supports " + supported_websites +
				"<br/>Current: " + hostname;
		});
	});

	chrome.tabs.query({ active: true, currentWindow: true },
		(tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: getBoard
			},
				(response) => {
					const foundGrid = response[0].result;
					if (!foundGrid) {
						output.innerHTML = "Please navigate to the sudoku puzzle screen";
					} else {
						output.innerHTML = "Found Grid";
					}
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