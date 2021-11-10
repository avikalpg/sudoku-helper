from typing import List
import requests
import board_parser
import sudoku_solver
import utils

def get_sudoku_board(game_url: str):
	r = requests.get(game_url)
	print(r.status_code)
	return board_parser.get_board(r.text)

def orchestrate_solution(board: List[List[str]]) -> List[List[str]]:
	matrix = utils.populate_options(board)
	solved_matrix, solution_state = sudoku_solver.solve(matrix)
	print(solution_state)
	return utils.convert_matrix_to_board(solved_matrix)

def main():
	# game_code = "EGMX"
	# game_url = "https://www.usdoku.com/"+game_code+"?source=lobby"
	# board = get_sudoku_board(game_url)

	with open('demo_html.html', 'r') as f:
		demo_html = f.read()
	board = board_parser.get_board(demo_html)
	utils.pretty_print_board(board)

	solved_board = orchestrate_solution(board)
	utils.pretty_print_board(solved_board)

if __name__ == '__main__':
	main()
