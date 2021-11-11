
export async function getCurrentHostname() {
	let tabs = await chrome.tabs.query({
		"active": true,
		"currentWindow": true,
		"status": "complete",
		"windowType": "normal"
	});
	try {
		var url = new URL(tabs[0].url);
		return url.hostname;
	}
	catch {
		return tabs[0]
	}
}