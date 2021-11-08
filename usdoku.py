from typing import List
import requests
import board_parser

def get_sudoku_board(game_url: str):
	r = requests.get(game_url)
	print(r.status_code)
	return board_parser.get_board(r.text)

def pretty_print_board(board: List[List[str]]):
	row_count = 0
	for row in board:
		if row_count % 3 == 0:
			print("-" * 33)
		print(' | '.join(row))
		row_count += 1
	print("-" * 33)

def main():
	# game_code = "EGMX"
	# game_url = "https://www.usdoku.com/"+game_code+"?source=lobby"
	# board = get_sudoku_board(game_url)

	with open('demo_html.html', 'r') as f:
		demo_html = f.read()
	board = board_parser.get_board(demo_html)
	pretty_print_board(board)

if __name__ == '__main__':
	main()
