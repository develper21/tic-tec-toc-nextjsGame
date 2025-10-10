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
			<div className="mx-auto max-w-5xl px-4 py-12">
				<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-bold">Replay</h1>
					<p className="text-sm text-gray-700">{p1?.username} vs {p2?.username}</p>
					<ol className="mt-6 list-decimal space-y-2 rounded-xl bg-gray-50 p-4">
						{moves.map((m, i: number) => (
							<li key={m._id} className="rounded bg-white px-3 py-2 shadow-sm">
								Move {i + 1}: {(i % 2 === 0 ? 'X' : 'O')} to cell {m.position}
							</li>
						))}
					</ol>
				</section>
			</div>
		</main>
	)
}