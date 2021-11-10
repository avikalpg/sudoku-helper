from SolveState import SolveState
from typing import List, Tuple
import utils
from sudoku_solver import SudokuSolver
from copy import deepcopy

def solve_sudoku(board: List[List[str]]) -> List[List[str]]:
	matrix = utils.populate_options(board)
	solved_matrix, solution_state = orchestrate_solution(matrix)
	if solution_state == SolveState.SOLVED:
		return utils.convert_matrix_to_board(solved_matrix)
	elif solution_state == SolveState.UNSOLVABLE:
		print ("Board cannot be solved")
		return None
	else:
		raise Exception("[solve_sudoku] Something went wrong")

def orchestrate_solution(matrix: List[List[List[int]]]) -> Tuple[List[List[List[int]]], SolveState]:
	board_solver = SudokuSolver(matrix)
	solved_matrix, solution_state = board_solver.solve()
	print(solution_state)

	if solution_state != SolveState.UNSOLVED:
		return solved_matrix, solution_state
	else:
		n, r, c = find_minimum_options(solved_matrix)
		print(n, r, c)
		print(solved_matrix[r][c])
		e_solved_matrix, solution_state = experiment_values(solved_matrix, r, c)
		return e_solved_matrix, solution_state

def find_minimum_options(m: List[List[List[int]]]) -> Tuple[int, int, int]:
	min_count = 9
	r, c = -1, -1
	i, j = 0, 0
	for row in m:
		for cell in row:
			if len(cell) != 1 and len(cell) < min_count:
				min_count = len(cell)
				r, c = i, j
			j += 1
		i += 1
		j = 0
	return min_count, r, c

def experiment_values(matrix: List[List[List[int]]], row_index: int, column_index: int) -> Tuple[List[List[List[int]]], SolveState]:
	options = matrix[row_index][column_index]
	solved_matrices = list()
	for option in options:
		print("Trying " + str(option) + " at (" + str(row_index) + "," + str(column_index) + ")")
		temp_m = deepcopy(matrix)
		temp_m[row_index][column_index] = [option]
		sm, ss = orchestrate_solution(temp_m)
		if ss == SolveState.SOLVED:
			return sm, ss
		else:
			solved_matrices.append((sm, ss))
	print(solved_matrices)
	for _, ss in solved_matrices:
		assert(ss == SolveState.UNSOLVABLE)
	return None, SolveState.UNSOLVABLE
