import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Player } from '@/models/Player'
import Link from 'next/link'

export const metadata = {
	title: 'User History | Tic Tac Toe',
	description: 'See games for a selected player',
}

export const dynamic = 'force-dynamic'

type PopPlayer = { _id: string; username: string }

type GameDoc = {
	_id: string
	player1?: PopPlayer
	player2?: PopPlayer
	status: 'open' | 'active' | 'finished'
	winner?: PopPlayer
	createdAt?: Date
	endedAt?: Date
}

export default async function UserHistoryPage({ params }: { params: Promise<{ playerId: string }> }) {
	const { playerId } = await params
	await connectToDatabase()
	const player = (await Player.findById(playerId).lean()) as unknown as { username?: string } | null
	const games = (await Game.find({ $or: [{ player1: playerId }, { player2: playerId }] })
		.sort({ createdAt: -1 })
		.populate('player1')
		.populate('player2')
		.populate('winner')
		.lean()) as unknown as GameDoc[]
	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-5xl px-4 py-12">
				<h1 className="text-2xl font-bold">{player?.username}&apos;s Games</h1>
				<div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-700">
							<tr>
								<th className="px-4 py-3 text-left font-semibold">Opponent</th>
								<th className="px-4 py-3 text-left font-semibold">Result</th>
								<th className="px-4 py-3 text-left font-semibold">When</th>
								<th className="px-4 py-3 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{games.map((g) => {
								const isP1 = g.player1?._id?.toString?.() === playerId
								const opponent = isP1 ? g.player2?.username : g.player1?.username
								let result = 'Draw'
								if (g.winner) {
									result = g.winner._id?.toString?.() === playerId ? 'Win' : 'Loss'
								}
								const when = g.endedAt || g.createdAt
								return (
									<tr key={g._id} className="hover:bg-gray-50">
										<td className="px-4 py-3">{opponent || '—'}</td>
										<td className="px-4 py-3">{result}</td>
										<td className="px-4 py-3">{when ? new Date(when).toLocaleString() : '—'}</td>
										<td className="px-4 py-3">
											<Link className="rounded-lg bg-gray-900 px-3 py-1 text-white hover:bg-black" href={`/history/${g._id}`}>Replay</Link>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	)
}
