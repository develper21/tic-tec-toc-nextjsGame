import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Move } from '@/models/Move'
import { NextResponse } from 'next/server'

export async function GET(_: Request, context: unknown) {
	await connectToDatabase()
	const { gameId } = await (context as { params: Promise<{ gameId: string }> }).params
	const game = await Game.findById(gameId).populate('player1').populate('player2').lean()
	if (!game) return NextResponse.json({ error: 'not found' }, { status: 404 })
	const moves = await Move.find({ gameId }).sort({ timestamp: 1 }).lean()
	return NextResponse.json({ game, moves })
}
