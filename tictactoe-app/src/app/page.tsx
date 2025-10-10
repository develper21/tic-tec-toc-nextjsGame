import { redirect } from 'next/navigation';
import Link from 'next/link'
import { headers } from 'next/headers'

export const metadata = {
	title: 'Tic Tac Toe Multiplayer | Home',
	description: 'Create or join Tic Tac Toe games built with Next.js and MongoDB',
}

export default function Page() {
	return (
		<main className="min-h-[calc(100vh-120px)] text-black">
			<div className="mx-auto max-w-5xl px-4 py-12">
				<h1 className="text-4xl font-extrabold tracking-tight">Tic Tac Toe Multiplayer</h1>
				<p className="mt-3 text-gray-700">Create a game or join an open one.</p>

				<div className="mt-10 grid gap-6 md:grid-cols-3">
					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold">Create Game</h2>
						<form className="mt-4 space-y-3">
							<input name="player1Username" placeholder="Your username" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
							<button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors" formAction={async (formData) => {
								'use server'
								const username = String(formData.get('player1Username') || '')
								const origin = (await headers()).get('origin') || 'http://localhost:3000'
								const res = await fetch(`${origin}/api/games`, { method: 'POST', body: JSON.stringify({ player1Username: username }) })
								const game = await res.json()
								if (game?._id) {
									redirect(`/game/${game._id}`)
								}
							}}>Create</button>
						</form>
					</section>

					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold">Join Game by ID</h2>
						<form className="mt-4 space-y-3">
							<input name="joinGameId" placeholder="Game ID" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
							<input name="joinUsername" placeholder="Your username (O)" className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
							<button className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors" formAction={async (formData) => {
								'use server'
								const gameId = String(formData.get('joinGameId') || '')
								const username = String(formData.get('joinUsername') || '')
								if (!gameId || !username) return
								const origin = (await headers()).get('origin') || 'http://localhost:3000'
								await fetch(`${origin}/api/games/${gameId}/join`, {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ player2Username: username }),
								})
								redirect(`/game/${gameId}`)
							}}>Join</button>
						</form>
					</section>

					<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold">Quick Links</h2>
						<div className="mt-4 space-y-3">
							<Link className="block rounded-lg border px-3 py-2 hover:bg-gray-50" href="/leaderboard">Leaderboard (SSR)</Link>
							<Link className="block rounded-lg border px-3 py-2 hover:bg-gray-50" href="/history">History (ISR)</Link>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}
