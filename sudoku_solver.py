from SolveState import SolveState
from typing import List, Tuple
import utils
from copy import deepcopy

class SudokuSolver():
	def __init__(self, matrix: List[List[List[int]]]) -> None:
		self.m = matrix
		self.state = SolveState.UNSOLVED
		self.seq_steps = list()

	def check_and_add_steps(self, r: int, c: int, reason: str) -> bool:
		if len(self.m[r][c]) == 1:
			self.seq_steps.append(((r+1, c+1), self.m[r][c][0], reason))
			return True
		return False

	def eliminate_options(self, r: int, c: int):
		if len(self.m[r][c]) == 1:
			return self.m

		# remove repetitions in row
		for i in range(9):
			if i == c:
				continue
			if len(self.m[r][i]) == 1:
				if self.m[r][i][0] in self.m[r][c]:
					self.m[r][c].remove(self.m[r][i][0])

		# remove repetitions in column
		for i in range(9):
			if i == r:
				continue
			if len(self.m[i][c]) == 1:
				if self.m[i][c][0] in self.m[r][c]:
					self.m[r][c].remove(self.m[i][c][0])

		# remove repetitions in box
		box_r = r // 3
		box_c = c // 3
		for i in range(3):
			for j in range(3):
				br = box_r * 3 + i
				bc = box_c * 3 + j
				if br == r and bc == c:
					continue
				if len(self.m[br][bc]) == 1:
					if self.m[br][bc][0] in self.m[r][c]:
						self.m[r][c].remove(self.m[br][bc][0])
		self.check_and_add_steps(r, c, "By elimination")

	def run_elimination(self, verbose: bool = False):
		for r in range(9):
			for c in range(9):
				self.eliminate_options(r, c)
		if verbose:
			utils.pretty_print_matrix(self.m)

	def apply_confirmations_by_elimination(self, r: int, c: int):
		if len(self.m[r][c]) == 1:
			return self.m

		# apply confirmations in row
		for e in self.m[r][c]:
			found = False
			for i in range(9):
				if i == c:
					continue
				if e in self.m[r][i]:
					found = True

			if found == False:
				self.m[r][c] = [e]
				self.check_and_add_steps(r, c, "Only element missing in row")
				return

		# apply confirmations in columns
		for e in self.m[r][c]:
			found = False
			for i in range(9):
				if i == r:
					continue
				if e in self.m[i][c]:
					found = True

			if found == False:
				self.m[r][c] = [e]
				self.check_and_add_steps(r, c, "Only element missing in column")
				return

		# apply confirmations in box
		box_r = r // 3
		box_c = c // 3
		for e in self.m[r][c]:
			found = False
			for i in range(3):
				for j in range(3):
					br = box_r * 3 + i
					bc = box_c * 3 + j
					if br == r and bc == c:
						continue
					if e in self.m[br][bc]:
						found = True

			if found == False:
				self.m[r][c] = [e]
				self.check_and_add_steps(r, c, "Only element missing in box")
				return

	def run_confirmations_by_elimination(self, verbose: bool = False):
		for r in range(9):
			for c in range(9):
				self.apply_confirmations_by_elimination(r, c)
		if verbose:
			utils.pretty_print_matrix(self.m)

	def get_matrix_stats(self) -> int:
		cells_fixed = 0
		solve_state = SolveState.UNSOLVED
		for row in self.m:
			for cell in row:
				if len(cell) == 1:
					cells_fixed += 1
				elif len(cell) == 0:
					solve_state = SolveState.UNSOLVABLE
					break
		print(str(cells_fixed) + " / " + str(81))
		if cells_fixed == 81:
			solve_state = SolveState.SOLVED
		self.state = solve_state
		return cells_fixed

	def solve(self) -> List[List[List[int]]]:
		solution_progress = self.get_matrix_stats()

		repeat_count = 0
		while solution_progress < 81 and self.state == SolveState.UNSOLVED:
			print ("========================")
			prev_mat = deepcopy(self.m)
			self.run_elimination(verbose=False)
			solution_progress = self.get_matrix_stats()
			self.run_confirmations_by_elimination(verbose=False)
			solution_progress = self.get_matrix_stats()

			if self.m == prev_mat:
				repeat_count += 1
				if repeat_count > 3:
					print("Could not converge")
					break
			else:
				repeat_count = 0

		return self.m