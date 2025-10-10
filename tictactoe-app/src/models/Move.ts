import { Schema, model, models, type Model, Types } from 'mongoose'

export interface IMove {
	gameId: Types.ObjectId
	playerId: Types.ObjectId
	position: number
	timestamp: Date
}

const MoveSchema = new Schema<IMove>({
	gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
	playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
	position: { type: Number, required: true, min: 0, max: 8 },
	timestamp: { type: Date, default: Date.now },
})

export const Move: Model<IMove> = models.Move || model<IMove>('Move', MoveSchema)
