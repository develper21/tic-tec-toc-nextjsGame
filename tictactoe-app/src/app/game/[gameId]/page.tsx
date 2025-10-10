"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'

type MoveDto = { position: number }
type GameDto = { _id: string; status: 'open' | 'active' | 'finished'; player1?: unknown; player2?: unknown; winner?: unknown }
type GameResponse = { game: GameDto; moves: MoveDto[] }

function Square({ value, onClick }: { value: string | null; onClick: () => void }) {
	return (
		<button onClick={onClick} className="flex h-20 w-20 items-center justify-center rounded border text-2xl font-bold hover:bg-gray-50">
			{value}
		</button>
	)
}

export default function GamePage(props: unknown) {
	const { params } = (props as { params: { gameId: string } })
	const [data, setData] = useState<GameResponse | null>(null)
	const [username, setUsername] = useState('')

	const load = useCallback(async () => {
		const res = await fetch(`/api/games/${params.gameId}`, { cache: 'no-store' })
		const json: GameResponse = await res.json()
		setData(json)
	}, [params.gameId])

	useEffect(() => {
		load()
		const id = setInterval(load, 1500)
		return () => clearInterval(id)
	}, [load])

	const board = useMemo(() => {
		const b = Array(9).fill(null) as (string | null)[]
		for (let i = 0; i < (data?.moves?.length || 0); i++) {
			b[data!.moves[i].position] = i % 2 === 0 ? 'X' : 'O'
		}
		return b
	}, [data])

	async function makeMove(i: number) {
		if (!username) return alert('Enter username (must match a player)')
		await fetch(`/api/games/${params.gameId}/move`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playerUsername: username, position: i }),
		})
		await load()
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-4 py-10">
				<h1 className="text-2xl font-semibold">Game</h1>
				<p className="text-sm text-gray-600">Game ID: {params.gameId}</p>
				<div className="mt-4 flex gap-2">
					<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" className="rounded border px-3 py-2" />
					<button onClick={() => load()} className="rounded border px-3 py-2">Refresh</button>
				</div>
				<div className="mt-6 grid grid-cols-3 gap-2">
					{board.map((v, i) => (
						<Square key={i} value={v} onClick={() => makeMove(i)} />
					))}
				</div>

				<div className="mt-6 rounded border bg-white p-4">
					<h2 className="font-medium">Status</h2>
					<pre className="mt-2 text-sm text-gray-700">{JSON.stringify(data?.game, null, 2)}</pre>
				</div>
			</div>
		</main>
	)
}
