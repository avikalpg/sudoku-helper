from typing import List
import utils

def populate_options(board: List[List[str]]) -> List[List[List[int]]]:
	matrix = list()
	for row in board:
		m_row = list()
		for cell in row:
			if cell == ' ':
				m_row.append([o for o in range(1,10)])
			else:
				m_row.append([int(cell)])
		matrix.append(m_row)
	return matrix

def convert_matrix_to_board(matrix: List[List[List[int]]]) -> List[List[str]]:
	board = list()
	for row in matrix:
		b_row = list()
		for cell in row:
			if len(cell) == 1:
				b_row.append(str(cell[0]))
			else:
				b_row.append(' ')
				# b_row.append(','.join([str(n) for n in cell]))
		board.append(b_row)
	return board

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
	utils.pretty_print_board(convert_matrix_to_board(new_m))
	return new_m

def get_matrix_stats(m: List[List[List[int]]]) -> int:
	cells_fixed = 0
	for row in m:
		for cell in row:
			if len(cell) == 1:
				cells_fixed += 1
	print(str(cells_fixed) + " / " + str(81))
	return cells_fixed

def solve(board: List[List[str]]) -> List[List[str]]:
	matrix = populate_options(board)
	solution_progress = get_matrix_stats(matrix)

	while solution_progress < 81:
		print ("========================")
		matrix = run_elimination(matrix)
		solution_progress = get_matrix_stats(matrix)

	return convert_matrix_to_board(matrix)