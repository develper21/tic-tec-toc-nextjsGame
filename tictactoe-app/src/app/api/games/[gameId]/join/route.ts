import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Player } from '@/models/Player'
import { NextResponse } from 'next/server'

export async function POST(request: Request, context: unknown) {
	await connectToDatabase()
	const { gameId } = await (context as { params: Promise<{ gameId: string }> }).params
	const body = await request.json()
	const { player2Username } = body || {}
	if (!player2Username) return NextResponse.json({ error: 'player2Username required' }, { status: 400 })
	const game = await Game.findById(gameId)
	if (!game) return NextResponse.json({ error: 'not found' }, { status: 404 })
	if (game.status !== 'open') return NextResponse.json({ error: 'game not open' }, { status: 400 })
	let player2 = await Player.findOne({ username: player2Username })
	if (!player2) player2 = await Player.create({ username: player2Username })
	game.player2 = player2._id
	game.status = 'active'
	await game.save()
	return NextResponse.json(game)
}
