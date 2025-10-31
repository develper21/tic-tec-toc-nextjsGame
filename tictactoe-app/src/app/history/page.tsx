import { connectToDatabase } from '@/lib/db'
import { Player } from '@/models/Player'
import Link from 'next/link'
import { ScrollText, Users, Gamepad2, Zap, Target, ArrowRight } from 'lucide-react'

export const metadata = {
	title: 'History | Tic Tac Toe',
	description: 'Browse player histories and game summaries',
}

export const dynamic = 'force-dynamic'

type PlayerDto = { _id: string; username: string }

export default async function HistoryPage() {
	await connectToDatabase()
	const players = (await Player.find({}).sort({ username: 1 }).lean()) as unknown as PlayerDto[]
	
	const gradients = [
		'from-indigo-500 to-purple-500',
		'from-pink-500 to-rose-500',
		'from-teal-500 to-cyan-500',
		'from-orange-500 to-red-500',
		'from-green-500 to-emerald-500',
		'from-blue-500 to-indigo-500',
		'from-violet-500 to-purple-500',
		'from-fuchsia-500 to-pink-500',
	]
	
	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-7xl px-4 py-12">
				{/* Header */}
				<div className="text-center mb-12 animate-[slideInUp_0.6s_ease-out]">
					<h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
						<ScrollText className="w-14 h-14 text-indigo-400" />
						<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-glow">
							Game History
						</span>
					</h1>
					<p className="text-gray-400 text-lg">Browse player profiles and game records</p>
				</div>

				{/* Stats Overview */}
				<div className="grid md:grid-cols-3 gap-6 mb-12">
					<div className="glass rounded-3xl p-6 border-2 border-indigo-500/30 card-hover animate-[slideInUp_0.8s_ease-out]">
						<Users className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
						<p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
							{players.length}
						</p>
						<p className="text-sm text-gray-400 mt-1">Total Players</p>
					</div>
					<div className="glass rounded-3xl p-6 border-2 border-pink-500/30 card-hover animate-[slideInUp_1s_ease-out]">
						<Gamepad2 className="w-12 h-12 text-pink-400 mx-auto mb-2" />
						<p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
							Active
						</p>
						<p className="text-sm text-gray-400 mt-1">Community Status</p>
					</div>
					<div className="glass rounded-3xl p-6 border-2 border-teal-500/30 card-hover animate-[slideInUp_1.2s_ease-out]">
						<Zap className="w-12 h-12 text-teal-400 mx-auto mb-2" />
						<p className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
							Live
						</p>
						<p className="text-sm text-gray-400 mt-1">Real-time Updates</p>
					</div>
				</div>

				{/* Players List */}
				<div className="glass rounded-3xl p-8 border-2 border-purple-500/30 animate-[slideInUp_1.4s_ease-out]">
					<h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
						<Target className="w-7 h-7" /> Player Profiles
					</h2>
					
					{players.length === 0 ? (
						<div className="text-center py-12">
							<Gamepad2 className="w-20 h-20 text-purple-400 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">No players yet. Be the first to play!</p>
						</div>
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							{players.map((p, index) => {
								const gradient = gradients[index % gradients.length]
								const delay = (index % 9) * 0.1
								return (
									<div 
										key={p._id} 
										className="glass rounded-2xl p-6 border border-white/10 card-hover group relative overflow-hidden"
										style={{ animationDelay: `${delay}s` }}
									>
										<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
										<div className="relative z-10">
											<div className="flex items-center justify-between mb-4">
												<div className={`w-12 h-12 rounded-xl glass border-2 border-white/20 flex items-center justify-center text-2xl bg-gradient-to-br ${gradient} bg-clip-text text-transparent font-bold`}>
													{p.username.charAt(0).toUpperCase()}
												</div>
												<Link 
													className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg btn-glow flex items-center gap-2`}
													href={`/history/user/${p._id}`}
												>
													View <ArrowRight className="w-4 h-4" />
												</Link>
											</div>
											<h3 className="text-xl font-bold text-white mb-2">{p.username}</h3>
											<p className="text-sm text-gray-400">Click to view game history</p>
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
