"use client"

import { use, useCallback, useEffect, useMemo, useState } from 'react'
import { Zap, Swords, Trophy, Clock, RefreshCw, Target, BarChart3 } from 'lucide-react'

type MoveDto = { position: number }
type PlayerPop = { username?: string; _id?: string } | null | undefined
type GameDto = { _id: string; status: 'open' | 'active' | 'finished'; player1?: PlayerPop; player2?: PlayerPop; winner?: PlayerPop }
type GameResponse = { game: GameDto; moves: MoveDto[] }

function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
	const isX = value === 'X'
	const isO = value === 'O'
	const isEmpty = !value
	
	return (
		<button 
			onClick={onClick} 
			className={`
				relative flex h-28 w-28 items-center justify-center rounded-2xl text-5xl font-extrabold 
				transition-all duration-300 overflow-hidden group
				${isEmpty ? 'glass border-2 border-white/20 hover:border-indigo-400/50 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30' : ''}
				${isX ? 'glass border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/40 animate-[pulse_2s_ease-in-out_infinite]' : ''}
				${isO ? 'glass border-2 border-pink-500/50 shadow-lg shadow-pink-500/40 animate-[pulse_2s_ease-in-out_infinite]' : ''}
			`}
		>
			{isEmpty && (
				<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			)}
			{isX && (
				<span className="relative z-10 bg-gradient-to-br from-indigo-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]">
					X
				</span>
			)}
			{isO && (
				<span className="relative z-10 bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
					O
				</span>
			)}
		</button>
	)
}

export default function GamePage(props: unknown) {
	const { params } = (props as { params: Promise<{ gameId: string }> })
	const { gameId } = use(params)
	const [data, setData] = useState<GameResponse | null>(null)
	const [username, setUsername] = useState('')
	const [joinName, setJoinName] = useState('')

	const load = useCallback(async () => {
		const res = await fetch(`/api/games/${gameId}`, { cache: 'no-store' })
		const json: GameResponse = await res.json()
		setData(json)
	}, [gameId])

	useEffect(() => {
		load()
		const id = setInterval(load, 1200)
		return () => clearInterval(id)
	}, [load])

	const board = useMemo(() => {
		const b = Array(9).fill(null) as (string | null)[]
		for (let i = 0; i < (data?.moves?.length || 0); i++) {
			b[data!.moves[i].position] = i % 2 === 0 ? 'X' : 'O'
		}
		return b
	}, [data])

	const p1 = data?.game?.player1
	const p2 = data?.game?.player2
	const p1Name = (p1?.username || 'Player 1')
	const p2Name = (p2?.username || (data?.game?.status === 'open' ? 'Waiting…' : 'Player 2'))
	const movesCount = data?.moves?.length || 0
	const nextSymbol = movesCount % 2 === 0 ? 'X' : 'O'
	const nextName = nextSymbol === 'X' ? p1Name : p2Name
	const winnerUsername = (data?.game?.winner as PlayerPop)?.username

	async function makeMove(i: number) {
		if (!username) return alert('Enter username (must match a player)')
		await fetch(`/api/games/${gameId}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playerUsername: username, position: i }),
		})
		await load()
	}

	async function joinGame() {
		if (!joinName) return
		await fetch(`/api/games/${gameId}/join`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ player2Username: joinName }),
		})
		setJoinName('')
		await load()
	}

	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid gap-8 lg:grid-cols-[1fr,400px]">
					{/* Game Board Section */}
					<section className="glass rounded-3xl p-8 border-2 border-indigo-500/30 card-hover animate-[slideInUp_0.6s_ease-out]">
						<div className="mb-6">
							<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400 bg-clip-text text-transparent neon-glow flex items-center gap-2">
								<Zap className="w-8 h-8" /> Game Arena
							</h1>
							<p className="text-sm text-gray-400 mt-2">Game ID: <span className="text-indigo-400 font-mono">{gameId}</span></p>
						</div>

						{/* Players Info */}
						<div className="flex items-center justify-around mb-6 gap-4">
							<div className="glass rounded-2xl px-6 py-4 border border-indigo-500/30 flex-1 text-center">
								<div className="text-3xl mb-2 bg-gradient-to-br from-indigo-400 to-indigo-600 bg-clip-text text-transparent font-bold">X</div>
								<p className="text-sm text-gray-300 font-medium">{p1Name}</p>
							</div>
							<Swords className="w-8 h-8 text-yellow-400" />
							<div className="glass rounded-2xl px-6 py-4 border border-pink-500/30 flex-1 text-center">
								<div className="text-3xl mb-2 bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent font-bold">O</div>
								<p className="text-sm text-gray-300 font-medium">{p2Name}</p>
							</div>
						</div>

						{/* Game Status */}
						{data?.game?.status === 'active' && (
							<div className="mb-6 text-center glass rounded-2xl px-4 py-3 border border-teal-500/30 animate-pulse">
								<p className="text-lg font-semibold">
									<span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
										Turn: {nextSymbol} ({nextName})
									</span>
								</p>
							</div>
						)}
						{data?.game?.status === 'finished' && (
							<div className="mb-6 text-center glass rounded-2xl px-4 py-3 border border-green-500/30 animate-[pulse_1.5s_ease-in-out_infinite]">
								<p className="text-xl font-bold flex items-center justify-center gap-2">
									<Trophy className="w-6 h-6 text-green-400" />
									<span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
										Winner: {winnerUsername || 'Draw'}
									</span>
								</p>
							</div>
						)}
						{data?.game?.status === 'open' && (
							<div className="mb-6 text-center glass rounded-2xl px-4 py-3 border border-yellow-500/30 animate-pulse">
								<p className="text-lg font-semibold text-yellow-400 flex items-center justify-center gap-2">
									<Clock className="w-6 h-6" /> Waiting for Player 2...
								</p>
							</div>
						)}

						{/* Game Board */}
						<div className="flex justify-center">
							<div className="grid grid-cols-3 gap-4 p-6 glass rounded-3xl border-2 border-white/10">
								{board.map((v, i) => (
									<Square key={i} value={v} onClick={() => makeMove(i)} />
								))}
							</div>
						</div>
					</section>

					{/* Controls Sidebar */}
					<aside className="space-y-6">
						{/* Player Controls */}
						<div className="glass rounded-3xl p-6 border-2 border-pink-500/30 animate-[slideInUp_0.8s_ease-out]">
							<h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent flex items-center gap-2">
								<Target className="w-6 h-6" /> Controls
							</h2>
							<div className="space-y-3">
								<input 
									value={username} 
									onChange={(e) => setUsername(e.target.value)} 
									placeholder="Your username" 
									className="w-full rounded-xl glass border border-pink-500/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-500 text-white" 
								/>
								<button 
									onClick={() => load()} 
									className="w-full rounded-xl glass border border-pink-500/30 px-4 py-3 hover:bg-pink-500/10 transition-all duration-300 hover:scale-105 font-medium flex items-center justify-center gap-2"
								>
									<RefreshCw className="w-5 h-5" /> Refresh Game
								</button>
							</div>
						</div>

						{/* Join Game Section */}
						{data?.game?.status === 'open' && !p2 && (
							<div className="glass rounded-3xl p-6 border-2 border-teal-500/30 animate-[slideInUp_1s_ease-out]">
								<h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
									<Target className="w-6 h-6" /> Join Game
								</h3>
								<div className="space-y-3">
									<input 
										value={joinName} 
										onChange={(e) => setJoinName(e.target.value)} 
										placeholder="Your username" 
										className="w-full rounded-xl glass border border-teal-500/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all placeholder-gray-500 text-white" 
									/>
									<button 
										onClick={joinGame} 
										className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 font-bold text-white hover:from-teal-500 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/70 hover:scale-105 btn-glow flex items-center justify-center gap-2"
									>
										<Zap className="w-5 h-5" /> Join Now
									</button>
								</div>
							</div>
						)}

						{/* Game Stats */}
						<div className="glass rounded-3xl p-6 border-2 border-indigo-500/30 animate-[slideInUp_1.2s_ease-out]">
							<h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
								<BarChart3 className="w-6 h-6" /> Game Stats
							</h3>
							<div className="space-y-3">
								<div className="glass rounded-xl p-4 border border-indigo-500/20">
									<p className="text-sm text-gray-400">Status</p>
									<p className="text-lg font-semibold text-indigo-400 capitalize">{data?.game?.status}</p>
								</div>
								<div className="glass rounded-xl p-4 border border-indigo-500/20">
									<p className="text-sm text-gray-400">Total Moves</p>
									<p className="text-lg font-semibold text-indigo-400">{movesCount}</p>
								</div>
								{data?.game?.status === 'finished' && (
									<div className="glass rounded-xl p-4 border border-green-500/30 bg-green-500/5">
										<p className="text-sm text-gray-400">Winner</p>
										<p className="text-lg font-semibold text-green-400">{winnerUsername || 'Draw'}</p>
									</div>
								)}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	)
}
