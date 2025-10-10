import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Move } from '@/models/Move'
import { NextResponse } from 'next/server'

export async function GET(_: Request, context: unknown) {
	await connectToDatabase()
	const { params } = context as { params: { playerId: string } }
	const games = await Game.find({ $or: [{ player1: params.playerId }, { player2: params.playerId }] })
		.sort({ createdAt: -1 })
		.lean()
	const gameIds = games.map((g) => g._id)
	const movesByGame = await Move.find({ gameId: { $in: gameIds } }).sort({ timestamp: 1 }).lean()
	return NextResponse.json({ games, moves: movesByGame })
}
