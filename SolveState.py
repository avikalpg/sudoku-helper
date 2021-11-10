from enum import Enum, auto

class SolveState(Enum):
	SOLVED = auto()
	UNSOLVED = auto()
	UNSOLVABLE = auto()