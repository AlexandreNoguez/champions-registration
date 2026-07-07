import mongoose from 'mongoose';
import { getServerEnv } from './env';

let cached = globalThis as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

export async function connectToDatabase() {
  if (cached.mongoose?.conn) {
    return cached.mongoose.conn;
  }

  if (!cached.mongoose?.promise) {
    const { MONGODB_URI } = getServerEnv();

    cached.mongoose = {
      conn: null,
      promise: mongoose.connect(MONGODB_URI),
    };
  }

  cached.mongoose.conn = await cached.mongoose.promise;
  return cached.mongoose.conn;
}
