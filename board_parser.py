import bs4

def find_grid(soup):
	if soup != None and soup.contents:
		if type(soup) != bs4.element.Tag and type(soup) != bs4.BeautifulSoup:
			print("========")
			print(len(soup.contents))
			print(type(soup.contents[0]))
			return None
		if len(soup.contents) == 81:
			return soup
		else:
			for soup_content in soup.contents:
				if type(soup_content) == bs4.element.Tag:
					grid = find_grid(soup_content)
					if grid != None:
						return grid

def get_value_from_cell(soup):
	if len(soup.contents[0].contents) == 1:
		return soup.contents[0].text
	elif len(soup.contents[0].contents) == 9:
		return ' '
	else:
		print("ERROR: Something unexpected occurred")

def get_matrix_from_grid(grid_soup):
	assert(len(grid_soup.contents) == 81)
	matrix = list()
	for i in range(9):
		row = list()
		for j in range(9):
			row.append(get_value_from_cell(grid_soup.contents[9*i + j]))
		matrix.append(row)
	return matrix

def get_board(page_file):
	page = bs4.BeautifulSoup(page_file, 'html.parser')
	grid = find_grid(page)
	if len(grid.contents) == 81:
		print("Found Grid")

	matrix = get_matrix_from_grid(grid)
	return matrix

def main():
	with open('demo_html.html', 'r') as f:
		demo_html = f.read()
	board = get_board(demo_html)
	print(board)

if __name__ == '__main__':
	main()