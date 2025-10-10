import { Schema, model, models, type Model } from 'mongoose'

export interface IPlayer {
	username: string
	wins: number
	losses: number
	draws: number
}

const PlayerSchema = new Schema<IPlayer>({
	username: { type: String, unique: true, required: true, trim: true },
	wins: { type: Number, default: 0 },
	losses: { type: Number, default: 0 },
	draws: { type: Number, default: 0 },
})

export const Player: Model<IPlayer> = models.Player || model<IPlayer>('Player', PlayerSchema)
