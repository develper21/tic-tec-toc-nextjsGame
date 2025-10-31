import { connectToDatabase } from '@/lib/db'
import { Player } from '@/models/Player'
import { Trophy, Medal, Award, BarChart3 } from 'lucide-react'

export const metadata = {
	title: 'Leaderboard | Tic Tac Toe',
	description: 'Top players ranked by wins',
}

export const dynamic = 'force-dynamic'

type PlayerDto = { _id: string; username: string; wins?: number; losses?: number; draws?: number }

export default async function LeaderboardPage() {
	await connectToDatabase()
	const players = (await Player.find({}).sort({ wins: -1, username: 1 }).lean()) as unknown as PlayerDto[]
	
	const getRankEmoji = (index: number) => {
		if (index === 0) return '🥇'
		if (index === 1) return '🥈'
		if (index === 2) return '🥉'
		return `#${index + 1}`
	}
	
	const getRankColor = (index: number) => {
		if (index === 0) return 'from-yellow-400 to-yellow-600'
		if (index === 1) return 'from-gray-300 to-gray-500'
		if (index === 2) return 'from-orange-400 to-orange-600'
		return 'from-indigo-400 to-indigo-600'
	}
	
	const getRankBorder = (index: number) => {
		if (index === 0) return 'border-yellow-500/50 shadow-yellow-500/30'
		if (index === 1) return 'border-gray-400/50 shadow-gray-400/30'
		if (index === 2) return 'border-orange-500/50 shadow-orange-500/30'
		return 'border-indigo-500/30 shadow-indigo-500/20'
	}
	
	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-7xl px-4 py-12">
				{/* Header */}
				<div className="text-center mb-12 animate-[slideInUp_0.6s_ease-out]">
					<h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
						<Trophy className="w-14 h-14 text-yellow-400" />
						<span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent neon-glow">
							Leaderboard
						</span>
					</h1>
					<p className="text-gray-400 text-lg">Top players ranked by victories</p>
				</div>

				{/* Top 3 Podium */}
				{players.length >= 3 && (
					<div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
						{/* 2nd Place */}
						<div className="md:order-1 animate-[slideInUp_0.8s_ease-out]">
							<div className="glass rounded-3xl p-6 border-2 border-gray-400/50 card-hover shadow-lg shadow-gray-400/30 text-center">
								<div className="mb-3 animate-[float_3s_ease-in-out_infinite]">
									<Medal className="w-20 h-20 text-gray-400 mx-auto" />
								</div>
								<h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
									{players[1].username}
								</h3>
								<div className="space-y-2 mt-4">
									<div className="glass rounded-xl p-3 border border-gray-400/30">
										<p className="text-sm text-gray-400">Wins</p>
										<p className="text-2xl font-bold text-gray-300">{players[1].wins || 0}</p>
									</div>
									<div className="text-sm text-gray-400">
										Win Rate: {(() => {
											const total = (players[1]?.wins || 0) + (players[1]?.losses || 0) + (players[1]?.draws || 0)
											return total ? Math.round(((players[1]?.wins || 0) / total) * 100) : 0
										})()}%
									</div>
								</div>
							</div>
						</div>

						{/* 1st Place */}
						<div className="md:order-2 animate-[slideInUp_0.6s_ease-out]">
							<div className="glass rounded-3xl p-8 border-2 border-yellow-500/50 card-hover shadow-xl shadow-yellow-500/40 text-center transform md:scale-110">
								<div className="mb-3 animate-[float_3s_ease-in-out_infinite]">
									<Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
								</div>
								<h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent neon-glow">
									{players[0].username}
								</h3>
								<div className="space-y-2 mt-4">
									<div className="glass rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
										<p className="text-sm text-gray-400">Wins</p>
										<p className="text-3xl font-bold text-yellow-400">{players[0].wins || 0}</p>
									</div>
									<div className="text-sm text-gray-400">
										Win Rate: {(() => {
											const total = (players[0]?.wins || 0) + (players[0]?.losses || 0) + (players[0]?.draws || 0)
											return total ? Math.round(((players[0]?.wins || 0) / total) * 100) : 0
										})()}%
									</div>
								</div>
							</div>
						</div>

						{/* 3rd Place */}
						<div className="md:order-3 animate-[slideInUp_1s_ease-out]">
							<div className="glass rounded-3xl p-6 border-2 border-orange-500/50 card-hover shadow-lg shadow-orange-500/30 text-center">
								<div className="mb-3 animate-[float_3s_ease-in-out_infinite_0.5s]">
									<Award className="w-20 h-20 text-orange-400 mx-auto" />
								</div>
								<h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
									{players[2].username}
								</h3>
								<div className="space-y-2 mt-4">
									<div className="glass rounded-xl p-3 border border-orange-500/30">
										<p className="text-sm text-gray-400">Wins</p>
										<p className="text-2xl font-bold text-orange-400">{players[2].wins || 0}</p>
									</div>
									<div className="text-sm text-gray-400">
										Win Rate: {(() => {
											const total = (players[2]?.wins || 0) + (players[2]?.losses || 0) + (players[2]?.draws || 0)
											return total ? Math.round(((players[2]?.wins || 0) / total) * 100) : 0
										})()}%
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Full Rankings */}
				<div className="glass rounded-3xl border-2 border-indigo-500/30 overflow-hidden animate-[slideInUp_1.2s_ease-out]">
					<div className="p-6 border-b border-white/10">
						<h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
							<BarChart3 className="w-7 h-7" /> All Rankings
						</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead className="glass border-b border-white/10">
								<tr>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Rank</th>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Player</th>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Wins</th>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Losses</th>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Draws</th>
									<th className="px-6 py-4 text-left font-semibold text-gray-300">Win Rate</th>
								</tr>
							</thead>
							<tbody>
								{players.map((p, index) => {
									const total = (p.wins || 0) + (p.losses || 0) + (p.draws || 0)
									const rate = total ? Math.round(((p.wins || 0) / total) * 100) : 0
									return (
										<tr 
											key={p._id} 
											className={`border-b border-white/5 hover:bg-white/5 transition-all duration-300 ${index < 3 ? 'bg-white/5' : ''}`}
										>
											<td className="px-6 py-4">
												<span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl glass border ${getRankBorder(index)} font-bold bg-gradient-to-r ${getRankColor(index)} bg-clip-text text-transparent`}>
													{getRankEmoji(index)}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className="font-semibold text-white">{p.username}</span>
											</td>
											<td className="px-6 py-4">
												<span className="text-green-400 font-semibold">{p.wins || 0}</span>
											</td>
											<td className="px-6 py-4">
												<span className="text-red-400 font-semibold">{p.losses || 0}</span>
											</td>
											<td className="px-6 py-4">
												<span className="text-yellow-400 font-semibold">{p.draws || 0}</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center gap-2">
													<div className="w-24 h-2 glass rounded-full overflow-hidden">
														<div 
															className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-500"
															style={{ width: `${rate}%` }}
														></div>
													</div>
													<span className="text-indigo-400 font-semibold">{rate}%</span>
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</main>
	)
}
