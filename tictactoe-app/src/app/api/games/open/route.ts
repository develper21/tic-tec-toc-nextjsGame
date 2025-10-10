import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { NextResponse } from 'next/server'

export async function GET() {
	await connectToDatabase()
	const games = await Game.find({ status: 'open' }).populate('player1').lean()
	return NextResponse.json(games)
}
