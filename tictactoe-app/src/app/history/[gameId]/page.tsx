import 'server-only'
import { connectToDatabase } from '@/lib/db'
import { Game } from '@/models/Game'
import { Move } from '@/models/Move'

export const metadata = {
	title: 'Replay | Tic Tac Toe',
	description: 'Replay a finished game',
}

type PlayerDoc = { username?: string } | null | undefined

type MoveDoc = { _id: string; position: number }

export default async function ReplayPage(props: unknown) {
	const { params } = props as { params: { gameId: string } }
	await connectToDatabase()
	const game = await Game.findById(params.gameId).populate('player1').populate('player2').lean()
	if (!game) return <div className="p-6">Not found</div>
	const moves = (await Move.find({ gameId: params.gameId }).sort({ timestamp: 1 }).lean()) as unknown as MoveDoc[]
	const p1 = (game as unknown as { player1?: PlayerDoc }).player1
	const p2 = (game as unknown as { player2?: PlayerDoc }).player2
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-4 py-10">
				<h1 className="text-2xl font-semibold">Replay</h1>
				<p className="text-sm text-gray-600">{p1?.username} vs {p2?.username}</p>
				<ol className="mt-6 list-decimal space-y-1 rounded border bg-white p-4">
					{moves.map((m, i: number) => (
						<li key={m._id}>
							Move {i + 1}: {(i % 2 === 0 ? 'X' : 'O')} to cell {m.position}
						</li>
					))}
				</ol>
			</div>
		</main>
	)
}
