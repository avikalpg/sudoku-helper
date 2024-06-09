# sudoku-helper
This project helps you solve Sudoku puzzles by giving hints and reasoning.

There are two major steps in the process:
1. Parse the current sudoku board
2. Solve the board and give the next steps for you

The algorithm used for solving the board is rule-based.
And whenever the rule-based solver cannot proceed, it experiments with different values to see which leads to a successful solution.

This solver can handle cases where a sudoku puzzle might have multiple solutions (due to incorrect question setting).

## Chrome extension
Install the Chrome extension in your browser and go to the [Usdoku](https://usdoku.com) website.
Click on the extension to see the popup with the hint for the next step.

## Python script
#### Setting up the environment
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Run for Usdoku
To use this for the [Usdoku](https://usdoku.com) website, you can copy the `body` of the HTML page into a TXT file (for example, the `multi_answer_html.txt` file).
Make sure that the `html_file_name` variable in the `usdoku.py` file is pointing to the file where you have pasted the HTML from the website.
Then run:
```bash
python3 usdoku.py
```
