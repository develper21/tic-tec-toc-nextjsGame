import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Player } from '@/models/Player'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	await connectToDatabase()
	const body = await request.json()
	const { player1Username } = body || {}
	if (!player1Username) return NextResponse.json({ error: 'player1Username required' }, { status: 400 })
	let player1 = await Player.findOne({ username: player1Username })
	if (!player1) player1 = await Player.create({ username: player1Username })
	const game = await Game.create({ player1: player1._id, status: 'open' })
	return NextResponse.json(game, { status: 201 })
}
