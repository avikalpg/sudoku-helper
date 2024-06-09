function prettyPrintBoard(board) {
	let rowCount = 0;
	for (let row of board) {
		if (rowCount % 3 == 0) {
			console.log("-".repeat(33));
		}
		console.log(row.join(' | '));
		rowCount++;
	}
	console.log("-".repeat(33));
}

/**
 *
 * @param {number[][]} board
 * @returns {number[][][]}
 */
export function populateOptions(board) {
	let matrix = [];
	for (let row of board) {
		let mRow = [];
		for (let cell of row) {
			if (cell == ' ') {
				mRow.push([...Array(9).keys()].map(i => i + 1));
			} else {
				mRow.push([parseInt(cell)]);
			}
		}
		matrix.push(mRow);
	}
	return matrix;
}

export function convertMatrixToBoard(matrix) {
	let board = [];
	for (let row of matrix) {
		let bRow = [];
		for (let cell of row) {
			if (cell.length == 1) {
				bRow.push(cell[0].toString());
			} else {
				bRow.push(' ');
			}
		}
		board.push(bRow);
	}
	return board;
}

function prettyPrintMatrix(matrix) {
	prettyPrintBoard(convertMatrixToBoard(matrix));
}

export function printSteps(steps) {
	for (let step of steps) {
		console.log(`${step[0]} \t ${step[1]} \t reason: ${step[2]}`);
	}
}
