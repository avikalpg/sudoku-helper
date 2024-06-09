
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

	function getValueFromCell(dom) {
		if (dom.firstChild.childElementCount == 0) {
			return dom.firstChild.textContent;
		}
		else if (dom.firstChild.childElementCount == 9) {
			return ' ';
		}
		else {
			console.error("ERROR: Something unexpected occurred")
			return ' ';
		}
	}

	function getMatrixFromGrid(grid_dom) {
		console.assert(grid_dom.childElementCount == 81, "ERROR: Exactly 81 elements to be present");
		var matrix = [];
		for (let i = 0; i < 9; i++) {
			let row = [];
			for (let j = 0; j < 9; j++) {
				row.push(getValueFromCell(grid_dom.children[9 * i + j]))
			}
			matrix.push(row);
		}
		return matrix
	}

	const grid = findGrid(document.body);
	if (grid == null) {
		console.warn("WARNING: Grid not found");
		return null;
	}
	if (grid.childElementCount == 81) {
		console.info("Found Grid");
		// save the grid
		matrix = getMatrixFromGrid(grid);
		return matrix;
	}
	else {
		console.warn("WARNING: 81 element grid not found");
		return null;
	}
}