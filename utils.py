from typing import List, Tuple

def pretty_print_board(board: List[List[str]]):
	row_count = 0
	for row in board:
		if row_count % 3 == 0:
			print("-" * 33)
		print(' | '.join(row))
		row_count += 1
	print("-" * 33)

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

def pretty_print_matrix(matrix: List[List[List[int]]]):
	pretty_print_board(convert_matrix_to_board(matrix))

def print_steps(steps: List[Tuple[Tuple[int, int], int, str]]):
	for step in steps:
		print(str(step[0]) + "\t" + str(step[1]) + "\treason: " + step[2])