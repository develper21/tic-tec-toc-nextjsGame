import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Trophy, ScrollText, Zap, Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tic Tac Toe Multiplayer",
  description: "Play Tic Tac Toe online with MongoDB and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col relative">
          {/* Animated Header */}
          <header className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
              <Link 
                href="/" 
                className="text-2xl font-bold neon-glow bg-gradient-to-r from-indigo-400 via-pink-400 to-teal-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 flex items-center gap-2"
              >
                <Zap className="w-6 h-6" /> Tic Tac Toe Arena
              </Link>
              <nav className="flex gap-2">
                <Link 
                  href="/leaderboard" 
                  className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-transparent hover:border-indigo-400/50 font-medium flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" /> Leaderboard
                </Link>
                <Link 
                  href="/history" 
                  className="px-4 py-2 rounded-lg glass hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-transparent hover:border-pink-400/50 font-medium flex items-center gap-2"
                >
                  <ScrollText className="w-5 h-5" /> History
                </Link>
              </nav>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex-1 relative z-10">
            {children}
          </div>
          
          {/* Animated Footer */}
          <footer className="glass border-t border-white/10 py-6 relative z-10">
            <div className="mx-auto max-w-7xl px-4 text-center">
              <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                Made with <Heart className="w-4 h-4 text-pink-400 animate-pulse fill-pink-400" /> | Tic Tac Toe Arena © 2024
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
