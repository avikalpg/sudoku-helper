from typing import List

def pretty_print_board(board: List[List[str]]):
	row_count = 0
	for row in board:
		if row_count % 3 == 0:
			print("-" * 33)
		print(' | '.join(row))
		row_count += 1
	print("-" * 33)