import { getCurrentHostname } from './src/board_parser.js'

let supported_websites = ['www.usdoku.com'];

chrome.runtime.onInstalled.addListener(() => {
	chrome.action.disable();
	chrome.storage.sync.set({ supported_websites });
	console.log('List of supported sudoku websites: ' + supported_websites);
	chrome.action.setTitle({ title: 'Sudoku Solver\nList of supported sudoku websites: ' + supported_websites });
});

chrome.tabs.onActivated.addListener(() => {
	chrome.storage.sync.get("supported_websites", ({ supported_websites }) => {
		getCurrentHostname().then((hostname) => {
			if (supported_websites.indexOf(hostname) != -1) {
				chrome.action.enable();
				chrome.action.setTitle({ title: 'Sudoku Solver' });
			} else {
				chrome.action.disable();
				chrome.action.setTitle({ title: 'Sudoku Solver\nList of supported sudoku websites: ' + supported_websites });
			}
		});
	});
})