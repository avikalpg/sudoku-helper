import SolveState from './SolveState.js';
import { RuleSolver } from './ruleSolver.js';
import { populateOptions, printSteps, convertMatrixToBoard } from './utils.js';

/**
 *
 * @param {number[][]} board Current board
 * @returns {{solvedBoard: number[][], steps: }[]} A list of solved boards
 */
export function solveSudoku(board) {
	const matrix = populateOptions(board);
	const possibleSolutions = orchestrateSolution(matrix);
	console.log(`Number of possible solutions: ${possibleSolutions.length}`);
	if (possibleSolutions.length === 0) {
		console.log('Board cannot be solved');
		return null;
	}
	console.dir(possibleSolutions);

	const solvedBoardsWithSteps = [];
	for (const [solvedMatrix, solutionState, seqSteps] of possibleSolutions) {
		if (solutionState === SolveState.SOLVED) {
			console.log('Number of steps: ', seqSteps.length);
			printSteps(seqSteps);
			console.log('-.'.repeat(15));
			solvedBoardsWithSteps.push({
				solvedBoard: convertMatrixToBoard(solvedMatrix),
				steps: seqSteps
			});
		}
	}

	return solvedBoardsWithSteps;
}

/**
 *
 * @param {number[][][]} matrix
 * @returns
 */
function orchestrateSolution(matrix) {
	const boardSolver = new RuleSolver(matrix);
	const solvedMatrix = boardSolver.solve();
	console.log(boardSolver.state);

	if (boardSolver.state === SolveState.SOLVED) {
		return [[solvedMatrix, boardSolver.state, boardSolver.seqSteps]];
	} else if (boardSolver.state === SolveState.UNSOLVABLE) {
		return [];
	} else {
		const [n, r, c] = findMinimumOptions(solvedMatrix);
		console.log(n, r, c);
		console.log(solvedMatrix[r][c]);
		const possibleSolutions = experimentValues(solvedMatrix, r, c);
		const possibleCompleteSolutions = [];
		for (const [eSolvedMatrix, solutionState, seqSteps] of possibleSolutions) {
			possibleCompleteSolutions.push([
				eSolvedMatrix,
				solutionState,
				boardSolver.seqSteps.concat(seqSteps)
			]);
		}
		return possibleCompleteSolutions;
	}
}

function findMinimumOptions(m) {
	let minCount = 9;
	let r = -1;
	let c = -1;
	for (let i = 0; i < m.length; i++) {
		const row = m[i];
		for (let j = 0; j < row.length; j++) {
			const cell = row[j];
			if (cell.length !== 1 && cell.length < minCount) {
				minCount = cell.length;
				r = i;
				c = j;
			}
		}
	}

	return [minCount, r, c];
}

function experimentValues(matrix, rowIndex, columnIndex) {
	const options = matrix[rowIndex][columnIndex];
	const matrices = [];

	for (const option of options) {
		console.log(`Trying ${option} at (${rowIndex},${columnIndex})`);
		const expStep = [
			[rowIndex + 1, columnIndex + 1],
			option,
			'Experimental'
		];

		const tempM = JSON.parse(JSON.stringify(matrix));
		tempM[rowIndex][columnIndex] = [option];

		const possibleSolutions = orchestrateSolution(tempM);

		for (const [sm, ss, steps] of possibleSolutions) {
			const stepsWithExp = [expStep, ...steps];
			matrices.push([sm, ss, stepsWithExp]);
		}
	}

	const solvedMatrices = matrices.filter(([sm, ss]) => ss === SolveState.SOLVED);

	if (solvedMatrices.length === 0) {
		return [];
	} else {
		return solvedMatrices;
	}
}
