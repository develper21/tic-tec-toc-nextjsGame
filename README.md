# Tic Tac Toe Multiplayer (Next.js + MongoDB Atlas)

A full-stack 2-player Tic Tac Toe web app built with Next.js App Router and MongoDB Atlas (Mongoose). Players join by username, play in real time (polling), and all games/moves/stats are persisted. Includes Leaderboard, Player History, and Replay. Demonstrates SSG, CSR, SSR, and ISR, with SEO metadata on each route.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict in app code)
- DB: MongoDB Atlas
- ORM: Mongoose
- Styling: Tailwind CSS (App template)
- Auth: Username only (no login)

## Key Features
- Create a game, share ID, second player joins, alternate X/O
- Persist games, moves, results to MongoDB
- Update Player stats (wins/losses/draws)
- Leaderboard ranked by wins
- Player History list and Game Replay
- Rendering modes:
  - SSG: Home `/`
  - CSR: Game board `/game/[gameId]`
  - SSR: Leaderboard `/leaderboard`
  - ISR: History `/history` (revalidate 30s)
- SEO metadata per route

## Project Structure (selected)
```
src/
  app/
    api/
      players/route.ts                # GET/POST players
      games/route.ts                  # POST create game
      games/open/route.ts             # GET open games
      games/[gameId]/route.ts         # GET game details + moves
      games/[gameId]/join/route.ts    # POST join game
      games/[gameId]/move/route.ts    # POST submit move
      history/[playerId]/route.ts     # GET player's games + moves
    page.tsx                          # Home (SSG): create & join by ID
    game/[gameId]/page.tsx            # Game (CSR)
    leaderboard/page.tsx              # Leaderboard (SSR)
    history/page.tsx                  # Players list (ISR)
    history/[gameId]/page.tsx         # Replay page (server)
    history/user/[playerId]/page.tsx  # Player’s game list (server)
    layout.tsx                        # App shell + SEO defaults
    globals.css
  lib/
    db.ts                             # Mongoose connection helper
    game.ts                           # Board/winner helpers
  models/
    Player.ts
    Game.ts
    Move.ts
```

## Database Schema
- Players
```
{
  username: string (unique, required),
  wins: number,
  losses: number,
  draws: number
}
```
- Games
```
{
  player1: ObjectId (ref: Player, required),
  player2?: ObjectId (ref: Player),
  status: 'open' | 'active' | 'finished',
  winner?: ObjectId (ref: Player),
  createdAt: Date,
  endedAt?: Date
}
```
- Moves
```
{
  gameId: ObjectId (ref: Game, required),
  playerId: ObjectId (ref: Player, required),
  position: number (0-8),
  timestamp: Date
}
```

## Routes & Rendering
- `/` (SSG): Create game, Join by ID, quick links
- `/game/[gameId]` (CSR): Live board polling; make moves; shows usernames, current turn, and winner
- `/leaderboard` (SSR): Real-time stats from MongoDB
- `/history` (ISR - 30s): Players list linking to per-user history
- `/history/user/[playerId]` (Server): All games for a user with opponent, result, time, and Replay button
- `/history/[gameId]` (Server): Replay move list

## API Endpoints
- `GET /api/players`: List players for leaderboard
- `POST /api/players`: Create player `{ username }`
- `POST /api/games`: Create a new game `{ player1Username }` → returns `{ _id }`
- `GET /api/games/open`: List open games
- `GET /api/games/[gameId]`: Game details with moves
- `POST /api/games/[gameId]/join`: Join open game `{ player2Username }`
- `POST /api/games/[gameId]/move`: Submit move `{ playerUsername, position }`
- `GET /api/history/[playerId]`: Player’s games + moves (raw)

## Setup
1) Create MongoDB Atlas cluster and user
2) Whitelist your IP or use `0.0.0.0/0` for development
3) Copy your connection URI
4) Create `.env.local` in project root with:
```
MONGODB_URI=ADD_YOUR_MONGO_ATLAS_URL
NEXT_PUBLIC_APP_NAME=Tic Tac Toe Multiplayer
```

## Develop
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build & Run
```bash
npm run build
npm start
```

## How to Play
- Home → Create Game (enter your username) → redirects to `/game/[gameId]`
- Share the Game ID to your friend
- Friend can:
  - Open Home → Join Game by ID (enter gameId + username), or
  - Open `/game/[gameId]`, use the Join box on the right
- The board alternates X (player1) and O (player2)
- At finish, winner/loser stats update; draws count for both
- View Leaderboard and History to confirm stats

## SEO & Metadata
Each route exports metadata (title, description) for better discoverability.

## Troubleshooting
- 500 on create/join in dev: ensure `MONGODB_URI` is set and MongoDB Atlas allows your IP
- Server action fetch: absolute origin is derived from `headers().get('origin')`
- If using another port/host, adjust origin fallback in `app/page.tsx`

## License

This project is licensed under the MIT License. See the License section below or the `LICENSE` file.

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

