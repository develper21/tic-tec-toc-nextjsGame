import { connectToDatabase } from '@/lib/db'
import { Player } from '@/models/Player'

export const metadata = {
	title: 'Leaderboard | Tic Tac Toe',
	description: 'Top players ranked by wins',
}

export const dynamic = 'force-dynamic'

type PlayerDto = { _id: string; username: string; wins?: number; losses?: number; draws?: number }

export default async function LeaderboardPage() {
	await connectToDatabase()
	const players = (await Player.find({}).sort({ wins: -1, username: 1 }).lean()) as unknown as PlayerDto[]
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-4 py-10">
				<h1 className="text-2xl font-semibold">Leaderboard (SSR)</h1>
				<div className="mt-6 overflow-hidden rounded-lg border bg-white">
					<table className="min-w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-4 py-2 text-left">Username</th>
								<th className="px-4 py-2 text-left">Wins</th>
								<th className="px-4 py-2 text-left">Losses</th>
								<th className="px-4 py-2 text-left">Draws</th>
								<th className="px-4 py-2 text-left">Win Rate</th>
							</tr>
						</thead>
						<tbody>
							{players.map((p) => {
								const total = (p.wins || 0) + (p.losses || 0) + (p.draws || 0)
								const rate = total ? Math.round(((p.wins || 0) / total) * 100) : 0
								return (
									<tr key={p._id} className="border-t">
										<td className="px-4 py-2">{p.username}</td>
										<td className="px-4 py-2">{p.wins || 0}</td>
										<td className="px-4 py-2">{p.losses || 0}</td>
										<td className="px-4 py-2">{p.draws || 0}</td>
										<td className="px-4 py-2">{rate}%</td>
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
