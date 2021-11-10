from SolveState import SolveState
from typing import List, Tuple
import utils

def eliminate_options(m: List[List[List[int]]], r: int, c: int) -> List[List[List[int]]]:
	if len(m[r][c]) == 1:
		return m

	# remove repetitions in row
	for i in range(9):
		if i == c:
			continue
		if len(m[r][i]) == 1:
			if m[r][i][0] in m[r][c]:
				m[r][c].remove(m[r][i][0])

	# remove repetitions in column
	for i in range(9):
		if i == r:
			continue
		if len(m[i][c]) == 1:
			if m[i][c][0] in m[r][c]:
				m[r][c].remove(m[i][c][0])

	# remove repetitions in box
	box_r = r // 3
	box_c = c // 3
	for i in range(3):
		for j in range(3):
			br = box_r * 3 + i
			bc = box_c * 3 + j
			if br == r and bc == c:
				continue
			if len(m[br][bc]) == 1:
				if m[br][bc][0] in m[r][c]:
					m[r][c].remove(m[br][bc][0])

	return m

def run_elimination(m: List[List[List[int]]]) -> List[List[List[int]]]:
	for r in range(9):
		for c in range(9):
			new_m = eliminate_options(m, r, c)
	utils.pretty_print_matrix(new_m)
	return new_m

def apply_confirmations_by_elimination(m: List[List[List[int]]], r: int, c: int) -> List[List[List[int]]]:
	if len(m[r][c]) == 1:
		return m

	# apply confirmations in row
	for e in m[r][c]:
		found = False
		for i in range(9):
			if i == c:
				continue
			if e in m[r][i]:
				found = True

		if found == False:
			m[r][c] = [e]
			continue

	# apply confirmations in columns
	for e in m[r][c]:
		found = False
		for i in range(9):
			if i == r:
				continue
			if e in m[i][c]:
				found = True

		if found == False:
			m[r][c] = [e]
			continue

	# apply confirmations in box
	box_r = r // 3
	box_c = c // 3
	for e in m[r][c]:
		found = False
		for i in range(3):
			for j in range(3):
				br = box_r * 3 + i
				bc = box_c * 3 + j
				if br == r and bc == c:
					continue
				if e in m[br][bc]:
					found = True

		if found == False:
			m[r][c] = [e]
			continue

	return m

def run_confirmations_by_elimination(m: List[List[List[int]]]) -> List[List[List[int]]]:
	for r in range(9):
		for c in range(9):
			new_m = apply_confirmations_by_elimination(m, r, c)
	utils.pretty_print_matrix(new_m)
	return new_m

def get_matrix_stats(m: List[List[List[int]]]) -> Tuple[int, SolveState]:
	cells_fixed = 0
	solve_state = SolveState.UNSOLVED
	for row in m:
		for cell in row:
			if len(cell) == 1:
				cells_fixed += 1
			elif len(cell) == 0:
				solve_state = SolveState.UNSOLVABLE
				break
	print(str(cells_fixed) + " / " + str(81))
	if cells_fixed == 81:
		solve_state = SolveState.SOLVED
	return cells_fixed, solve_state

def solve(matrix: List[List[List[int]]]) -> Tuple[List[List[List[int]]], SolveState]:
	solution_progress, solution_state = get_matrix_stats(matrix)

	repeat_count = 0
	while solution_progress < 81 and solution_state == SolveState.UNSOLVED:
		print ("========================")
		prev_mat = matrix.copy()
		matrix = run_elimination(matrix)
		solution_progress, solution_state = get_matrix_stats(matrix)
		matrix = run_confirmations_by_elimination(matrix)
		solution_progress, solution_state = get_matrix_stats(matrix)

		if matrix == prev_mat:
			repeat_count += 1
			if repeat_count > 3:
				print("Could not converge")
				break
		else:
			repeat_count = 0

	return matrix, solution_state