
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

export function getBoard() {

	function findGrid(dom) {
		if (!dom.hasChildNodes()) {
			return null;
		}
		if (dom.childElementCount == 81) {
			return dom;
		} else {
			for (node of dom.children) {
				const grid = findGrid(node);
				if (grid != null) {
					return grid;
				}
			}
		}
	}

	const grid = findGrid(document.body);
	if (grid == null) {
		console.warn("WARNING: Grid not found");
		return false;
	}
	if (grid.childElementCount == 81) {
		console.info("Found Grid");
		// save the grid
		// matrix = get_matrix_from_grid(grid)
		// return matrix

		return true;
	}
	else {
		console.warn("WARNING: 81 element grid not found");
		return false;
	}
}