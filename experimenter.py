from SolveState import SolveState
from typing import List, Tuple
import utils
from sudoku_solver import SudokuSolver
from copy import deepcopy

def solve_sudoku(board: List[List[str]]) -> List[List[str]]:
	matrix = utils.populate_options(board)
	solved_matrix, solution_state, seq_steps = orchestrate_solution(matrix)
	if solution_state == SolveState.SOLVED:
		print("Number of steps: ", len(seq_steps))
		utils.print_steps(seq_steps)
		return utils.convert_matrix_to_board(solved_matrix)
	elif solution_state == SolveState.UNSOLVABLE:
		print ("Board cannot be solved")
		return None
	else:
		raise Exception("[solve_sudoku] Something went wrong")

def orchestrate_solution(matrix: List[List[List[int]]]) -> Tuple[List[List[List[int]]], SolveState, List[Tuple[Tuple[int, int], int, str]]]:
	board_solver = SudokuSolver(matrix)
	solved_matrix = board_solver.solve()
	print(board_solver.state)

	if board_solver.state != SolveState.UNSOLVED:
		return solved_matrix, board_solver.state, board_solver.seq_steps
	else:
		n, r, c = find_minimum_options(solved_matrix)
		print(n, r, c)
		print(solved_matrix[r][c])
		e_solved_matrix, solution_state, seq_steps = experiment_values(solved_matrix, r, c)
		return e_solved_matrix, solution_state, board_solver.seq_steps + seq_steps

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

def experiment_values(matrix: List[List[List[int]]], row_index: int, column_index: int) -> Tuple[List[List[List[int]]], SolveState, List[Tuple[Tuple[int, int], int, str]]]:
	options = matrix[row_index][column_index]
	solved_matrices = list()
	for option in options:
		print("Trying " + str(option) + " at (" + str(row_index) + "," + str(column_index) + ")")
		exp_step = ((row_index+1, column_index+1), option, "Experimental")
		temp_m = deepcopy(matrix)
		temp_m[row_index][column_index] = [option]
		sm, ss, steps = orchestrate_solution(temp_m)
		steps = [exp_step] + steps
		if ss == SolveState.SOLVED:
			return sm, ss, steps
		else:
			solved_matrices.append((sm, ss, steps))
	print(solved_matrices)
	for _, ss, steps in solved_matrices:
		assert(ss == SolveState.UNSOLVABLE)
	return None, SolveState.UNSOLVABLE, steps
