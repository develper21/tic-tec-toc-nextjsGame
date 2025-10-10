import { connectToDatabase } from '@/lib/db'
import { Player } from '@/models/Player'
import { NextResponse } from 'next/server'

export async function GET() {
	await connectToDatabase()
	const players = await Player.find({}).sort({ wins: -1, username: 1 }).lean()
	return NextResponse.json(players)
}

export async function POST(request: Request) {
	try {
		await connectToDatabase()
		const body = await request.json()
		const username = (body?.username || '').trim()
		if (!username) return NextResponse.json({ error: 'username required' }, { status: 400 })
		const existing = await Player.findOne({ username })
		if (existing) return NextResponse.json(existing)
		const created = await Player.create({ username })
		return NextResponse.json(created, { status: 201 })
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown error'
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
