let supported_websites = ['www.usdoku.com'];

chrome.runtime.onInstalled.addListener(() => {
	chrome.action.disable();
	chrome.storage.sync.set({ supported_websites });
	console.log('List of supported sudoku websites: ' + supported_websites);
	chrome.action.setTitle({ title: 'Sudoku Solver\nList of supported sudoku websites: ' + supported_websites });
});

function updateIcon(tab) {
	if (tab && tab.url) {
		try {
			const url = new URL(tab.url);
			const hostname = url.hostname;
			chrome.storage.sync.get("supported_websites", ({ supported_websites }) => {
				if (supported_websites && supported_websites.includes(hostname)) {
					chrome.action.enable(tab.id);
					chrome.action.setTitle({ tabId: tab.id, title: 'Sudoku Solver' });
				} else {
					chrome.action.setTitle({ tabId: tab.id, title: 'Sudoku Solver\nList of supported sudoku websites: ' + supported_websites });
				}
			});
		} catch (error) {
			// Handle invalid URLs
			chrome.action.disable();
			chrome.action.setTitle({ tabId: tab.id, title: '[Sudoku Solver] Invalid URL' });
		}
	} else {
		chrome.action.disable();
		chrome.action.setTitle({ tabId: tab.id, title: 'Sudoku Solver could not read tab\'s URL' });
	}
}

chrome.tabs.onActivated.addListener((activeInfo) => {
	chrome.tabs.get(activeInfo.tabId, updateIcon);
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') { // Only check when the page has finished loading
		updateIcon(tab);
	}
})