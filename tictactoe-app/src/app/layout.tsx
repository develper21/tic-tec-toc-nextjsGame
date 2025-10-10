import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-lg font-semibold">Tic Tac Toe</a>
              <nav className="flex gap-4 text-sm">
                <a href="/leaderboard" className="hover:text-blue-600">Leaderboard</a>
                <a href="/history" className="hover:text-blue-600">History</a>
              </nav>
            </div>
          </header>
          <div className="flex-1 bg-gradient-to-b from-white to-blue-50">
            {children}
          </div>
          <footer className="border-t bg-white">
            <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-gray-600">
              Built with Next.js App Router + MongoDB
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
