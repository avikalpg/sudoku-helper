import requests
import board_parser
import sudoku_solver
import utils

def get_sudoku_board(game_url: str):
	r = requests.get(game_url)
	print(r.status_code)
	return board_parser.get_board(r.text)

def main():
	# game_code = "EGMX"
	# game_url = "https://www.usdoku.com/"+game_code+"?source=lobby"
	# board = get_sudoku_board(game_url)

	with open('demo_html.html', 'r') as f:
		demo_html = f.read()
	board = board_parser.get_board(demo_html)
	utils.pretty_print_board(board)

	solved_board = sudoku_solver.solve(board)
	utils.pretty_print_board(solved_board)

if __name__ == '__main__':
	main()
