from typing import List
import requests
import board_parser
import experimenter
import utils

def get_sudoku_board(game_url: str):
	r = requests.get(game_url)
	print(r.status_code)
	return board_parser.get_board(r.text)

def main():
	# game_code = "EGMX"
	# game_url = "https://www.usdoku.com/"+game_code+"?source=lobby"
	# board = get_sudoku_board(game_url)

	# html_file_name = 'easy_html_0.txt'
	# html_file_name = 'expert_html_0.txt'
	html_file_name = 'multi_answer_html.txt'

	with open(html_file_name, 'r') as f:
		demo_html = f.read()
	board = board_parser.get_board(demo_html)
	utils.pretty_print_board(board)

	solved_boards = experimenter.solve_sudoku(board)
	for solved_board in solved_boards:
		utils.pretty_print_board(solved_board)

if __name__ == '__main__':
	main()
