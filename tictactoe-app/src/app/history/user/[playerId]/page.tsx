import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Player } from '@/models/Player'
import Link from 'next/link'
import { User, Trophy, XCircle, Minus, Clock, Play, ArrowLeft } from 'lucide-react'

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
			<div className="mx-auto max-w-7xl px-4 py-12">
				{/* Header */}
				<div className="mb-8 animate-[slideInUp_0.6s_ease-out]">
					<Link href="/history" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
						<ArrowLeft className="w-5 h-5" /> Back to History
					</Link>
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-2xl glass border-2 border-indigo-500/30 flex items-center justify-center">
							<User className="w-10 h-10 text-indigo-400" />
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400 bg-clip-text text-transparent neon-glow">
								{player?.username}&apos;s Games
							</h1>
							<p className="text-gray-400 mt-1">Complete game history</p>
						</div>
					</div>
				</div>

				{/* Games List */}
				<div className="glass rounded-3xl border-2 border-purple-500/30 overflow-hidden animate-[slideInUp_0.8s_ease-out]">
					{games.length === 0 ? (
						<div className="text-center py-16">
							<Trophy className="w-20 h-20 text-gray-500 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">No games played yet</p>
						</div>
					) : (
						<div className="space-y-3 p-6">
							{games.map((g) => {
								const isP1 = g.player1?._id?.toString?.() === playerId
								const opponent = isP1 ? g.player2?.username : g.player1?.username
								let result = 'Draw'
								let resultColor = 'text-yellow-400'
								let ResultIcon = Minus
								if (g.winner) {
									const isWinner = g.winner._id?.toString?.() === playerId
									result = isWinner ? 'Win' : 'Loss'
									resultColor = isWinner ? 'text-green-400' : 'text-red-400'
									ResultIcon = isWinner ? Trophy : XCircle
								}
								const when = g.endedAt || g.createdAt
								return (
									<div key={g._id} className="glass rounded-2xl p-6 border border-white/10 hover:border-indigo-400/50 transition-all duration-300 card-hover">
										<div className="flex items-center justify-between flex-wrap gap-4">
											<div className="flex items-center gap-4 flex-1">
												<div className={`w-12 h-12 rounded-xl glass border-2 ${result === 'Win' ? 'border-green-500/50' : result === 'Loss' ? 'border-red-500/50' : 'border-yellow-500/50'} flex items-center justify-center`}>
													<ResultIcon className={`w-7 h-7 ${resultColor}`} />
												</div>
												<div>
													<p className="text-lg font-semibold text-white">vs {opponent || 'Unknown'}</p>
													<div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
														<Clock className="w-4 h-4" />
														{when ? new Date(when).toLocaleString() : '—'}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-4">
												<div className={`px-4 py-2 rounded-xl glass border ${result === 'Win' ? 'border-green-500/30 bg-green-500/10' : result === 'Loss' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
													<span className={`font-bold ${resultColor}`}>{result}</span>
												</div>
												<Link 
													className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:scale-105 btn-glow flex items-center gap-2" 
													href={`/history/${g._id}`}
												>
													<Play className="w-4 h-4" /> Replay
												</Link>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			</div>
		</main>
	)
}
