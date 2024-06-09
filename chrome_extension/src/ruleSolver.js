import SolveState from './SolveState.js';

export class RuleSolver {
	/**
	 *
	 * @param {number[][][]} matrix
	 */
	constructor(matrix) {
		this.m = matrix;
		this.state = SolveState.UNSOLVED;
		this.seqSteps = [];
	}

	getMatrixStats() {
		let cells_fixed = 0
		let solve_state = SolveState.UNSOLVED
		for (let row of this.m) {
			for (let cell of row) {
				if (cell.length == 1) {
					cells_fixed++;
				} else if (cell.length == 0) {
					solve_state = SolveState.UNSOLVABLE;
					break;
				}
			}
		}
		console.info(`${cells_fixed} / 81`);
		if (cells_fixed == 81) {
			solve_state = SolveState.SOLVED;
		}
		this.state = solve_state
		return cells_fixed
	}
	/**
	 *
	 * @param {number} r
	 * @param {number} c
	 * @param {string} reason
	 * @returns
	 */
	checkAndAddSteps(r, c, reason) {
		if (this.m[r][c].length == 1) {
			this.seqSteps.push([[r + 1, c + 1], this.m[r][c][0], reason]);
			return true;
		}
		return false;
	}

	eliminateOptions(r, c) {
		if (this.m[r][c].length == 1) {
			return this.m;
		}

		// remove repetitions in row
		for (let i = 0; i < 9; i++) {
			if (i === c) continue;
			if (this.m[r][i].length == 1) {
				let num = this.m[r][i][0];
				let index = this.m[r][c].indexOf(num);
				if (index > -1) {
					this.m[r][c].splice(index, 1);
				}
			}
		}

		// remove repetitions in column
		for (let i = 0; i < 9; i++) {
			if (i === r) continue;
			if (this.m[i][c].length == 1) {
				let num = this.m[i][c][0];
				let index = this.m[r][c].indexOf(num);
				if (index > -1) {
					this.m[r][c].splice(index, 1);
				}
			}
		}

		// remove repetitions in box
		let boxR = Math.floor(r / 3);
		let boxC = Math.floor(c / 3);

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				let br = boxR * 3 + i;
				let bc = boxC * 3 + j;
				if (br === r && bc === c) continue;

				if (this.m[br][bc].length == 1) {
					let num = this.m[br][bc][0];
					let index = this.m[r][c].indexOf(num);
					if (index > -1) {
						this.m[r][c].splice(index, 1);
					}
				}
			}
		}

		this.checkAndAddSteps(r, c, "By elimination");
	}

	runElimination(verbose = false) {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				this.eliminateOptions(r, c);
			}
		}
		if (verbose) {
			console.table(this.m);
		}
	}

	applyConfirmationsByElimination(r, c) {
		if (this.m[r][c].length == 1) {
			return this.m;
		}

		// apply confirmations in row
		for (let e of this.m[r][c]) {
			let found = false;
			for (let i = 0; i < 9; i++) {
				if (i === c) continue;
				if (this.m[r][i].includes(e)) {
					found = true;
					break;
				}
			}

			if (!found) {
				this.m[r][c] = [e];
				this.checkAndAddSteps(r, c, "Only element missing in row");
				return;
			}
		}

		// apply confirmations in column
		for (let e of this.m[r][c]) {
			let found = false;
			for (let i = 0; i < 9; i++) {
				if (i === r) continue;
				if (this.m[i][c].includes(e)) {
					found = true;
					break;
				}
			}

			if (!found) {
				this.m[r][c] = [e];
				this.checkAndAddSteps(r, c, "Only element missing in column");
				return;
			}
		}

		// apply confirmations in box
		let boxR = Math.floor(r / 3);
		let boxC = Math.floor(c / 3);

		for (let e of this.m[r][c]) {
			let found = false;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					let br = boxR * 3 + i;
					let bc = boxC * 3 + j;
					if (br === r && bc === c) continue;

					if (this.m[br][bc].includes(e)) {
						found = true;
						break;
					}
				}
			}

			if (!found) {
				this.m[r][c] = [e];
				this.checkAndAddSteps(r, c, "Only element missing in box");
				return;
			}
		}
	}

	runConfirmationsByElimination(verbose = false) {
		for (let r = 0; r < 9; r++) {
			for (let c = 0; c < 9; c++) {
				this.applyConfirmationsByElimination(r, c);
			}
		}
		if (verbose) {
			console.table(this.m);
		}
	}

	solve() {
		let solutionProgress = this.getMatrixStats();

		let repeatCount = 0;
		while (solutionProgress < 81 && this.state === SolveState.UNSOLVED) {
			console.log("========================");
			let prevMat = JSON.parse(JSON.stringify(this.m));
			this.runElimination(false);
			solutionProgress = this.getMatrixStats();
			this.runConfirmationsByElimination(false);
			solutionProgress = this.getMatrixStats();

			if (JSON.stringify(this.m) === JSON.stringify(prevMat)) {
				repeatCount++;
				if (repeatCount > 3) {
					console.log("Could not converge");
					break;
				}
			} else {
				repeatCount = 0;
			}
		}

		return this.m;
	}
}