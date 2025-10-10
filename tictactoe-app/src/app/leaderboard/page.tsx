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
		<main className="min-h-[calc(100vh-120px)] text-black">
			<div className="mx-auto max-w-5xl px-4 py-12">
				<h1 className="text-3xl font-bold">Leaderboard (SSR)</h1>
				<div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<table className="min-w-full text-sm">
						<thead className="bg-gray-50 text-gray-700">
							<tr>
								<th className="px-4 py-3 text-left font-semibold">Username</th>
								<th className="px-4 py-3 text-left font-semibold">Wins</th>
								<th className="px-4 py-3 text-left font-semibold">Losses</th>
								<th className="px-4 py-3 text-left font-semibold">Draws</th>
								<th className="px-4 py-3 text-left font-semibold">Win Rate</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{players.map((p) => {
								const total = (p.wins || 0) + (p.losses || 0) + (p.draws || 0)
								const rate = total ? Math.round(((p.wins || 0) / total) * 100) : 0
								return (
									<tr key={p._id} className="hover:bg-gray-50">
										<td className="px-4 py-3">{p.username}</td>
										<td className="px-4 py-3">{p.wins || 0}</td>
										<td className="px-4 py-3">{p.losses || 0}</td>
										<td className="px-4 py-3">{p.draws || 0}</td>
										<td className="px-4 py-3">{rate}%</td>
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
