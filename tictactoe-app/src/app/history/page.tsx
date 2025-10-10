import { connectToDatabase } from '@/lib/db'
import { Player } from '@/models/Player'
import Link from 'next/link'

export const metadata = {
	title: 'History | Tic Tac Toe',
	description: 'Browse player histories and game summaries',
}

export const revalidate = 30

type PlayerDto = { _id: string; username: string }

export default async function HistoryPage() {
	await connectToDatabase()
	const players = (await Player.find({}).sort({ username: 1 }).lean()) as unknown as PlayerDto[]
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-4 py-10">
				<h1 className="text-2xl font-semibold">History (ISR)</h1>
				<ul className="mt-6 space-y-2">
					{players.map((p) => (
						<li key={p._id} className="flex items-center justify-between rounded border bg-white px-4 py-2">
							<span>{p.username}</span>
							<Link className="rounded bg-gray-900 px-3 py-1 text-white" href={`/history/${p._id}`}>View</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
