import { Schema, model, models, type Model, Types } from 'mongoose'

export type GameStatus = 'open' | 'active' | 'finished'

export interface IGame {
	player1: Types.ObjectId
	player2?: Types.ObjectId
	status: GameStatus
	winner?: Types.ObjectId
	createdAt: Date
	endedAt?: Date
}

const GameSchema = new Schema<IGame>({
	player1: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
	player2: { type: Schema.Types.ObjectId, ref: 'Player' },
	status: { type: String, enum: ['open', 'active', 'finished'], default: 'open' },
	winner: { type: Schema.Types.ObjectId, ref: 'Player' },
	createdAt: { type: Date, default: Date.now },
	endedAt: { type: Date },
})

export const Game: Model<IGame> = models.Game || model<IGame>('Game', GameSchema)
