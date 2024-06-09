import { getCurrentHostname, getBoard } from './src/board_parser.js';
import { solveSudoku } from './src/experimenter.js';

const swSpan = document.getElementById('supported_websites_span');
const output = document.getElementById('output');

function updateSupportedWebsitesText() {
	chrome.storage.sync.get('supported_websites', ({ supported_websites }) => {
		getCurrentHostname().then((hostname) => {
			swSpan.innerHTML = `Supports ${supported_websites}
        <br/>Current: ${hostname}<br/>`;
		});
	});
}

function renderBoard(foundGrid, hint) {
	const boardTable = document.createElement('table');
	boardTable.id = 'sudoku_board';

	for (let [rowIndex, row] of foundGrid.entries()) {
		const rowElement = document.createElement('tr');
		rowElement.classList.add('sudoku_row');

		for (let [colIndex, cell] of row.entries()) {
			const cellElement = document.createElement('td');
			cellElement.classList.add('sudoku_cell');
			cellElement.textContent = cell;

			if (hint && (hint.location[0] - 1 === rowIndex) && (hint.location[1] - 1 === colIndex)) {
				cellElement.classList.add('hint');
				cellElement.textContent = hint.value;
			}

			rowElement.appendChild(cellElement);
		}
		boardTable.appendChild(rowElement);
	}

	return boardTable;
}

function getHint(solvedBoardsWithSteps) {
	const steps = (solvedBoardsWithSteps.length > 0) ? solvedBoardsWithSteps[0].steps : [];
	const nextStep = (steps.length > 0) ? steps[0] : null;
	const hint = nextStep ? {
		location: nextStep[0],
		value: nextStep[1],
		reason: nextStep[2],
	} : null;
	return hint;
}

function renderSolvedBoards(solvedBoardsWithSteps) {
	const solvedBoardsContainer = document.createElement('div');
	solvedBoardsContainer.id = 'solved_boards_container';

	solvedBoardsWithSteps.forEach(({ solvedBoard }, i) => {
		const solvedBoardItem = document.createElement('div');
		solvedBoardItem.className = 'solved_board_item';

		const titleElement = document.createElement('h4');
		titleElement.textContent = `Solution #${i + 1} `;

		const solvedBoardTable = document.createElement('table');
		solvedBoardTable.id = `solved_board_${i + 1} `;
		solvedBoardTable.className = 'sudoku_solved_board';

		for (let row of solvedBoard) {
			const rowElement = document.createElement('tr');
			rowElement.classList.add('sudoku_row');

			for (let cell of row) {
				const cellElement = document.createElement('td');
				cellElement.classList.add('sudoku_cell');
				cellElement.textContent = cell;
				rowElement.appendChild(cellElement);
			}
			solvedBoardTable.appendChild(rowElement);
		}

		solvedBoardItem.appendChild(titleElement);
		solvedBoardItem.appendChild(solvedBoardTable);
		solvedBoardsContainer.appendChild(solvedBoardItem);
	});

	return solvedBoardsContainer;
}

document.addEventListener('DOMContentLoaded', () => {
	updateSupportedWebsitesText();

	chrome.tabs.query({ active: true, currentWindow: true },
		(tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				func: getBoard
			},
				(response) => {
					const foundGrid = response[0].result;
					if (!foundGrid) {
						output.innerHTML = 'Please navigate to the sudoku puzzle screen';
						return;
					}

					const solvedBoardsWithSteps = solveSudoku(foundGrid);
					const hint = getHint(solvedBoardsWithSteps);

					const boardTable = renderBoard(foundGrid, hint);
					output.appendChild(boardTable);

					if (hint) {
						const hintReason = document.createElement('p');
						hintReason.classList.add('hint_reason');
						hintReason.textContent = `Next step: Update cell at (${hint.location[0]},${hint.location[1]}) to "${hint.value}" ${hint.reason.toLowerCase()}`;
						output.appendChild(hintReason);
					}

					const solvedBoardsContainer = renderSolvedBoards(solvedBoardsWithSteps);
					output.appendChild(solvedBoardsContainer);
				});
		});
});