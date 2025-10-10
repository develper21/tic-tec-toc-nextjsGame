import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Move } from '@/models/Move'
import { Player } from '@/models/Player'
import { calculateWinner, nextSymbolFromMoves, emptyBoard } from '@/lib/game'
import { NextResponse } from 'next/server'

export async function POST(request: Request, context: unknown) {
	await connectToDatabase()
	const { gameId } = await (context as { params: Promise<{ gameId: string }> }).params
	const body = await request.json()
	const { playerUsername, position } = body || {}
	if (typeof position !== 'number' || position < 0 || position > 8) {
		return NextResponse.json({ error: 'invalid position' }, { status: 400 })
	}
	const game = await Game.findById(gameId)
	if (!game) return NextResponse.json({ error: 'not found' }, { status: 404 })
	if (game.status !== 'active') return NextResponse.json({ error: 'game not active' }, { status: 400 })
	const player = await Player.findOne({ username: playerUsername })
	if (!player) return NextResponse.json({ error: 'player not found' }, { status: 404 })
	if (!game.player1 || !game.player2) return NextResponse.json({ error: 'game not ready' }, { status: 400 })
	const isPlayerInGame = player._id.equals(game.player1) || player._id.equals(game.player2)
	if (!isPlayerInGame) return NextResponse.json({ error: 'not your game' }, { status: 403 })
	const moves = await Move.find({ gameId: game._id }).sort({ timestamp: 1 })
	// build board
	const board = emptyBoard()
	for (let i = 0; i < moves.length; i++) {
		const symbol = i % 2 === 0 ? 'X' : 'O'
		board[moves[i].position] = symbol
	}
	// validate empty
	if (board[position] !== null) return NextResponse.json({ error: 'cell occupied' }, { status: 400 })
	// validate turn
	const nextSymbol = nextSymbolFromMoves(moves.length)
	const expectedPlayerId = nextSymbol === 'X' ? game.player1 : game.player2
	if (!player._id.equals(expectedPlayerId)) return NextResponse.json({ error: 'not your turn' }, { status: 400 })
	// create move
	await Move.create({ gameId: game._id, playerId: player._id, position })
	// recompute board and check end state
	const updatedMoves = await Move.find({ gameId: game._id }).sort({ timestamp: 1 })
	const board2 = emptyBoard()
	for (let i = 0; i < updatedMoves.length; i++) {
		const symbol = i % 2 === 0 ? 'X' : 'O'
		board2[updatedMoves[i].position] = symbol
	}
	const winnerSymbol = calculateWinner(board2)
	if (winnerSymbol || updatedMoves.length === 9) {
		game.status = 'finished'
		game.endedAt = new Date()
		if (winnerSymbol) {
			const winnerId = winnerSymbol === 'X' ? game.player1 : game.player2
			game.winner = winnerId
			await game.save()
			await Player.findByIdAndUpdate(winnerId, { $inc: { wins: 1 } })
			const loserId = winnerSymbol === 'X' ? game.player2 : game.player1
			await Player.findByIdAndUpdate(loserId, { $inc: { losses: 1 } })
		} else {
			await game.save()
			await Player.findByIdAndUpdate(game.player1, { $inc: { draws: 1 } })
			await Player.findByIdAndUpdate(game.player2, { $inc: { draws: 1 } })
		}
	}
	return NextResponse.json({ ok: true })
}
