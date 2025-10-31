import 'server-only'
import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Move } from '@/models/Move'
import { Play, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
	title: 'Replay | Tic Tac Toe',
	description: 'Replay a finished game',
}

export const dynamic = 'force-dynamic'

type PlayerDoc = { username?: string } | null | undefined

type MoveDoc = { _id: string; position: number }

export default async function ReplayPage({ params }: { params: Promise<{ gameId: string }> }) {
	const { gameId } = await params
	await connectToDatabase()
	const game = await Game.findById(gameId).populate('player1').populate('player2').lean()
	if (!game) return <div className="p-6">Not found</div>
	const moves = (await Move.find({ gameId }).sort({ timestamp: 1 }).lean()) as unknown as MoveDoc[]
	const p1 = (game as unknown as { player1?: PlayerDoc }).player1
	const p2 = (game as unknown as { player2?: PlayerDoc }).player2
	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-7xl px-4 py-12">
				{/* Header */}
				<div className="mb-8 animate-[slideInUp_0.6s_ease-out]">
					<Link href="/history" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
						<ArrowLeft className="w-5 h-5" /> Back to History
					</Link>
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-2xl glass border-2 border-pink-500/30 flex items-center justify-center">
							<Play className="w-10 h-10 text-pink-400" />
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent neon-glow">
								Game Replay
							</h1>
							<div className="flex items-center gap-2 text-gray-400 mt-1">
								<Users className="w-5 h-5" />
								<p>{p1?.username} vs {p2?.username}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Moves List */}
				<div className="glass rounded-3xl p-8 border-2 border-indigo-500/30 animate-[slideInUp_0.8s_ease-out]">
					<h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
						Move History
					</h2>
					{moves.length === 0 ? (
						<div className="text-center py-12">
							<Play className="w-20 h-20 text-gray-500 mx-auto mb-4" />
							<p className="text-gray-400 text-lg">No moves recorded</p>
						</div>
					) : (
						<div className="grid md:grid-cols-2 gap-4">
							{moves.map((m, i: number) => {
								const isX = i % 2 === 0
								return (
									<div 
										key={m._id} 
										className={`glass rounded-2xl p-6 border-2 ${isX ? 'border-indigo-500/30' : 'border-pink-500/30'} card-hover`}
									>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className={`w-12 h-12 rounded-xl glass border-2 ${isX ? 'border-indigo-500/50' : 'border-pink-500/50'} flex items-center justify-center text-2xl font-bold`}>
													<span className={`bg-gradient-to-br ${isX ? 'from-indigo-400 to-indigo-600' : 'from-pink-400 to-pink-600'} bg-clip-text text-transparent`}>
														{isX ? 'X' : 'O'}
													</span>
												</div>
												<div>
													<p className="text-sm text-gray-400">Move {i + 1}</p>
													<p className="text-lg font-semibold text-white">Cell {m.position}</p>
												</div>
											</div>
											<div className={`px-4 py-2 rounded-xl glass border ${isX ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-pink-500/30 bg-pink-500/10'}`}>
												<span className={`font-bold ${isX ? 'text-indigo-400' : 'text-pink-400'}`}>
													{isX ? p1?.username : p2?.username}
												</span>
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