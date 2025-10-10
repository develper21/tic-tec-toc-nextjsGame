import mongoose from 'mongoose'

declare global {
	var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

if (!global.mongooseConn) {
	global.mongooseConn = { conn: null, promise: null }
}

export async function connectToDatabase() {
	if (global.mongooseConn!.conn) return global.mongooseConn!.conn
	const uri = process.env.MONGODB_URI
	if (!uri) {
		throw new Error('Missing MONGODB_URI in environment')
	}
	if (!global.mongooseConn!.promise) {
		global.mongooseConn!.promise = mongoose.connect(uri, { bufferCommands: false })
	}
	global.mongooseConn!.conn = await global.mongooseConn!.promise
	return global.mongooseConn!.conn
}
