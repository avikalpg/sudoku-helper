import { getCurrentHostname, getBoard } from './src/board_parser.js'
import { solveSudoku } from './src/experimenter.js';

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
						const solvedBoardsWithSteps = solveSudoku(foundGrid);

						const boardTable = document.createElement('table');
						boardTable.id = 'sudoku_board';

						for (let row of foundGrid) {
							const rowElement = document.createElement('tr');
							rowElement.id = 'sudoku_row';

							for (let cell of row) {
								const cellElement = document.createElement('td');
								cellElement.id = 'sudoku_cell';
								cellElement.textContent = cell;
								rowElement.appendChild(cellElement);
							}

							boardTable.appendChild(rowElement);
						}

						output.appendChild(boardTable);

						const solvedBoardsContainer = document.createElement('div');
						solvedBoardsContainer.id = 'solved_boards_container';

						solvedBoardsWithSteps.forEach(({ solvedBoard }, i) => {
							const solvedBoardItem = document.createElement('div');
							solvedBoardItem.className = 'solved_board_item';

							const titleElement = document.createElement('h4');
							titleElement.textContent = `Solution #${i + 1}`;

							const solvedBoardTable = document.createElement('table');
							solvedBoardTable.id = `solved_board_${i + 1}`;
							solvedBoardTable.className = 'sudoku_solved_board';

							for (let row of solvedBoard) {
								const rowElement = document.createElement('tr');
								rowElement.id = 'sudoku_row';

								for (let cell of row) {
									const cellElement = document.createElement('td');
									cellElement.id = 'sudoku_cell';
									cellElement.textContent = cell;
									rowElement.appendChild(cellElement);
								}
								solvedBoardTable.appendChild(rowElement);
							}

							solvedBoardItem.appendChild(titleElement);
							solvedBoardItem.appendChild(solvedBoardTable);
							solvedBoardsContainer.appendChild(solvedBoardItem);
						});
						output.appendChild(solvedBoardsContainer);
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