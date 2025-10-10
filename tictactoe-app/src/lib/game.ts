export type Cell = 'X' | 'O' | null
export type Board = Cell[]

export function emptyBoard(): Board {
	return Array<Cell>(9).fill(null)
}

export function calculateWinner(board: Board): Cell {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]
	for (const [a, b, c] of lines) {
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return board[a]
		}
	}
	return null
}

export function isDraw(board: Board): boolean {
	return board.every((c) => c !== null) && !calculateWinner(board)
}

export function nextSymbolFromMoves(movesCount: number): 'X' | 'O' {
	return movesCount % 2 === 0 ? 'X' : 'O'
}
