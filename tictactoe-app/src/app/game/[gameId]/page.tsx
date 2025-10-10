"use client"

import { use, useCallback, useEffect, useMemo, useState } from 'react'

type MoveDto = { position: number }
type PlayerPop = { username?: string; _id?: string } | null | undefined
type GameDto = { _id: string; status: 'open' | 'active' | 'finished'; player1?: PlayerPop; player2?: PlayerPop; winner?: PlayerPop }
type GameResponse = { game: GameDto; moves: MoveDto[] }

function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
	return (
		<button onClick={onClick} className="flex h-24 w-24 items-center justify-center rounded-xl border border-gray-300 bg-white text-3xl font-extrabold hover:bg-gray-50 transition-colors">
			{value}
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
	const winnerName = data?.game?.winner && (data.game.winner as any).username ? (data.game.winner as any).username : undefined

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
		<main className="min-h-[calc(100vh-120px)] text-black">
			<div className="mx-auto max-w-5xl px-4 py-12">
				<div className="grid gap-8 md:grid-cols-[1fr,320px]">
					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h1 className="text-2xl font-bold">Game</h1>
						<p className="text-sm text-gray-700">Game ID: {gameId}</p>
						<div className="mt-3 flex items-center gap-4 text-sm">
							<span><span className="font-semibold">X</span>: {p1Name}</span>
							<span><span className="font-semibold">O</span>: {p2Name}</span>
						</div>
						{data?.game?.status === 'active' && (
							<p className="mt-1 text-sm text-blue-700">Turn: {nextSymbol} ({nextName})</p>
						)}
						{data?.game?.status === 'finished' && (
							<p className="mt-1 text-sm text-green-700">Winner: {winnerName || '—'}</p>
						)}
						<div className="mt-6 grid grid-cols-3 gap-3">
							{board.map((v, i) => (
								<Square key={i} value={v} onClick={() => makeMove(i)} />
							))}
						</div>
					</section>
					<aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold">Controls</h2>
						<div className="mt-3 flex gap-2">
							<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
							<button onClick={() => load()} className="rounded-lg border px-3 py-2 hover:bg-gray-50">Refresh</button>
						</div>
						{data?.game?.status === 'open' && !p2 && (
							<div className="mt-6">
								<h3 className="font-medium">Join this game</h3>
								<div className="mt-2 flex gap-2">
									<input value={joinName} onChange={(e) => setJoinName(e.target.value)} placeholder="Your username" className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
									<button onClick={joinGame} className="rounded-lg bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700">Join</button>
								</div>
							</div>
						)}
						<div className="mt-6">
							<h3 className="font-medium">Status</h3>
							<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
								<div className="rounded bg-gray-50 p-3">State: {data?.game?.status}</div>
								<div className="rounded bg-gray-50 p-3">Moves: {movesCount}</div>
								{data?.game?.status === 'finished' && <div className="col-span-2 rounded bg-green-50 p-3">Winner: {winnerName || '—'}</div>}
							</div>
						</div>
					</aside>
				</div>
			</div>
		</main>
	)
}
