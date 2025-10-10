import { redirect } from 'next/navigation';
import Link from 'next/link'

export const metadata = {
	title: 'Tic Tac Toe Multiplayer | Home',
	description: 'Create or join Tic Tac Toe games built with Next.js and MongoDB',
}

export default function Page() {
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-3xl px-4 py-10">
				<h1 className="text-3xl font-bold">Tic Tac Toe Multiplayer</h1>
				<p className="mt-2 text-gray-600">Create a game or join an open one. Built with Next.js App Router + MongoDB.</p>

				<div className="mt-8 grid gap-6 md:grid-cols-2">
					<section className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold">Create Game</h2>
						<form className="mt-4 space-y-3">
							<input name="player1Username" placeholder="Your username" className="w-full rounded border px-3 py-2" />
							<button className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" formAction={async (formData) => {
								'use server'
								const username = String(formData.get('player1Username') || '')
								const res = await fetch('/api/games', { method: 'POST', body: JSON.stringify({ player1Username: username }) })
								const game = await res.json()
								if (game?._id) {
									redirect(`/game/${game._id}`)
								}
							}}>Create</button>
						</form>
					</section>

					<section className="rounded-lg border bg-white p-6 shadow-sm">
						<h2 className="text-xl font-semibold">Quick Links</h2>
						<div className="mt-4 space-y-2">
							<Link className="block rounded border px-3 py-2 hover:bg-gray-50" href="/leaderboard">Leaderboard (SSR)</Link>
							<Link className="block rounded border px-3 py-2 hover:bg-gray-50" href="/history">History (ISR)</Link>
						</div>
					</section>
				</div>
			</div>
		</main>
	)
}
