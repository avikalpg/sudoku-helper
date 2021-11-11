from SolveState import SolveState
from typing import List, Tuple
import utils
from sudoku_solver import SudokuSolver
from copy import deepcopy

def solve_sudoku(board: List[List[str]]) -> List[List[str]]:
	matrix = utils.populate_options(board)
	possible_solutions = orchestrate_solution(matrix)
	print(f'Number of possible solutions: {len(possible_solutions)}')
	if len(possible_solutions) == 0:
		print ("Board cannot be solved")
		return None
	solved_boards = list()
	for solved_matrix, solution_state, seq_steps in possible_solutions:
		if solution_state == SolveState.SOLVED:
			print("Number of steps: ", len(seq_steps))
			utils.print_steps(seq_steps)
			print(".-"*15)
			solved_boards.append(utils.convert_matrix_to_board(solved_matrix))
	return solved_boards

def orchestrate_solution(matrix: List[List[List[int]]]) -> List[Tuple[List[List[List[int]]], SolveState, List[Tuple[Tuple[int, int], int, str]]]]:
	board_solver = SudokuSolver(matrix)
	solved_matrix = board_solver.solve()
	print(board_solver.state)

	if board_solver.state == SolveState.SOLVED:
		return [(solved_matrix, board_solver.state, board_solver.seq_steps)]
	elif board_solver.state == SolveState.UNSOLVABLE:
		return []
	else:
		n, r, c = find_minimum_options(solved_matrix)
		print(n, r, c)
		print(solved_matrix[r][c])
		possible_solutions = experiment_values(solved_matrix, r, c)
		possible_complete_solutions = list()
		for e_solved_matrix, solution_state, seq_steps in possible_solutions:
			possible_complete_solutions.append((e_solved_matrix, solution_state, board_solver.seq_steps + seq_steps))
		return possible_complete_solutions

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

def experiment_values(matrix: List[List[List[int]]], row_index: int, column_index: int) -> List[Tuple[List[List[List[int]]], SolveState, List[Tuple[Tuple[int, int], int, str]]]]:
	options = matrix[row_index][column_index]
	matrices = list()
	for option in options:
		print("Trying " + str(option) + " at (" + str(row_index) + "," + str(column_index) + ")")
		exp_step = ((row_index+1, column_index+1), option, "Experimental")
		temp_m = deepcopy(matrix)
		temp_m[row_index][column_index] = [option]
		possible_solutions = orchestrate_solution(temp_m)
		for sm, ss, steps in possible_solutions:
			steps = [exp_step] + steps
			matrices.append((sm, ss, steps))

	solved_matrices = list()
	for sm, ss, steps in matrices:
		if ss == SolveState.SOLVED:
			solved_matrices.append((sm, ss, steps))
		else:
			print(sm)
			assert(ss == SolveState.UNSOLVABLE)
	if len(solved_matrices) == 0:
		return []
	else:
		return solved_matrices
