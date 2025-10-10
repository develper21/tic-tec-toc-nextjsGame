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
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-5xl px-4 py-12">
				<h1 className="text-3xl font-bold">History (ISR)</h1>
				<ul className="mt-6 space-y-3">
					{players.map((p) => (
						<li key={p._id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
							<span className="font-medium">{p.username}</span>
							<Link className="rounded-lg bg-gray-900 px-3 py-1 text-white hover:bg-black" href={`/history/user/${p._id}`}>View</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
	)
}
