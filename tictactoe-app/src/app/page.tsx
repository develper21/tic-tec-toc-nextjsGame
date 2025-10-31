import { redirect } from 'next/navigation';
import Link from 'next/link'
import { headers } from 'next/headers'
import { Gamepad2, Target, Star, Globe, Save, BarChart3, Palette, Zap } from 'lucide-react'

export const metadata = {
	title: 'Tic Tac Toe Multiplayer | Home',
	description: 'Create or join Tic Tac Toe games built with Next.js and MongoDB',
}

export default function Page() {
	return (
		<main className="min-h-[calc(100vh-120px)]">
			<div className="mx-auto max-w-7xl px-4 py-16">
				{/* Hero Section */}
				<div className="text-center mb-16 animate-[slideInUp_0.6s_ease-out]">
					<h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
						<span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400 bg-clip-text text-transparent neon-glow">
							Tic Tac Toe
						</span>
						<br />
						<span className="text-4xl md:text-5xl bg-gradient-to-r from-teal-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
							Multiplayer Arena
						</span>
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto flex items-center justify-center gap-2">
						Challenge players worldwide in the ultimate Tic Tac Toe experience! <Zap className="w-6 h-6 text-yellow-400" />
					</p>
				</div>

				{/* Game Cards */}
				<div className="grid gap-8 md:grid-cols-3 mb-12">
					{/* Create Game Card */}
					<section className="glass rounded-3xl p-8 card-hover border-2 border-indigo-500/30 animate-[slideInUp_0.8s_ease-out] relative overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="relative z-10">
							<div className="mb-4 animate-[float_3s_ease-in-out_infinite]">
								<Gamepad2 className="w-16 h-16 text-indigo-400 mx-auto" />
							</div>
							<h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">
								Create Game
							</h2>
							<p className="text-gray-400 text-sm mb-6">Start a new game as Player X</p>
							<form className="space-y-4">
								<input 
									name="player1Username" 
									placeholder="Enter your username" 
									className="w-full rounded-xl glass border border-indigo-500/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500 text-white" 
								/>
								<button 
									className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 font-bold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/70 hover:scale-105 btn-glow flex items-center justify-center gap-2" 
									formAction={async (formData) => {
										'use server'
										const username = String(formData.get('player1Username') || '')
										const origin = (await headers()).get('origin') || 'http://localhost:3000'
										const res = await fetch(`${origin}/api/games`, { method: 'POST', body: JSON.stringify({ player1Username: username }) })
										const game = await res.json()
										if (game?._id) {
											redirect(`/game/${game._id}`)
										}
									}}
								>
									<Zap className="w-5 h-5" /> Create Game
								</button>
							</form>
						</div>
					</section>

					{/* Join Game Card */}
					<section className="glass rounded-3xl p-8 card-hover border-2 border-pink-500/30 animate-[slideInUp_1s_ease-out] relative overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="relative z-10">
							<div className="mb-4 animate-[float_3s_ease-in-out_infinite_0.5s]">
							<Target className="w-16 h-16 text-pink-400 mx-auto" />
						</div>
							<h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-pink-300 bg-clip-text text-transparent">
								Join Game
							</h2>
							<p className="text-gray-400 text-sm mb-6">Join an existing game as Player O</p>
							<form className="space-y-4">
								<input 
									name="joinGameId" 
									placeholder="Game ID" 
									className="w-full rounded-xl glass border border-pink-500/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-500 text-white" 
								/>
								<input 
									name="joinUsername" 
									placeholder="Your username" 
									className="w-full rounded-xl glass border border-pink-500/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-500 text-white" 
								/>
								<button 
									className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-6 py-3 font-bold text-white hover:from-pink-500 hover:to-pink-400 transition-all duration-300 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 hover:scale-105 btn-glow flex items-center justify-center gap-2" 
									formAction={async (formData) => {
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
									}}
								>
									<Zap className="w-5 h-5" /> Join Now
								</button>
							</form>
						</div>
					</section>

					{/* Quick Links Card */}
					<section className="glass rounded-3xl p-8 card-hover border-2 border-teal-500/30 animate-[slideInUp_1.2s_ease-out] relative overflow-hidden group">
						<div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<div className="relative z-10">
							<div className="mb-4 animate-[float_3s_ease-in-out_infinite_1s]">
							<Star className="w-16 h-16 text-teal-400 mx-auto" />
						</div>
							<h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
								Quick Access
							</h2>
							<p className="text-gray-400 text-sm mb-6">View stats and game history</p>
							<div className="space-y-3">
								<Link 
									className="block rounded-xl glass border border-teal-500/30 px-4 py-3 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105 hover:border-teal-400/50 font-medium text-center" 
									href="/leaderboard"
								>
									<BarChart3 className="w-5 h-5 inline mr-2" />Leaderboard
								</Link>
								<Link 
									className="block rounded-xl glass border border-teal-500/30 px-4 py-3 hover:bg-teal-500/10 transition-all duration-300 hover:scale-105 hover:border-teal-400/50 font-medium text-center" 
									href="/history"
								>
									<Save className="w-5 h-5 inline mr-2" />Game History
								</Link>
							</div>
						</div>
					</section>
				</div>

				{/* Features Section */}
				<div className="glass rounded-3xl p-8 border border-white/10 animate-[slideInUp_1.4s_ease-out]">
					<h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
						<Palette className="w-12 h-12 text-purple-400 mx-auto mb-2" /> Game Features
					</h3>
					<div className="grid md:grid-cols-4 gap-6 text-center">
						<div className="p-4">
						<Globe className="w-12 h-12 text-indigo-400 mx-auto mb-2" />
							<h4 className="font-semibold text-lg mb-1">Real-time</h4>
							<p className="text-sm text-gray-400">Live multiplayer gameplay</p>
						</div>
						<div className="p-4">
						<Save className="w-12 h-12 text-pink-400 mx-auto mb-2" />
							<h4 className="font-semibold text-lg mb-1">Auto-Save</h4>
							<p className="text-sm text-gray-400">Never lose your progress</p>
						</div>
						<div className="p-4">
						<BarChart3 className="w-12 h-12 text-teal-400 mx-auto mb-2" />
							<h4 className="font-semibold text-lg mb-1">Statistics</h4>
							<p className="text-sm text-gray-400">Track your performance</p>
						</div>
						<div className="p-4">
						<Palette className="w-12 h-12 text-purple-400 mx-auto mb-2" />
							<h4 className="font-semibold text-lg mb-1">Modern UI</h4>
							<p className="text-sm text-gray-400">Beautiful animations</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
