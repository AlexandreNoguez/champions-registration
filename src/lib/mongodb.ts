import mongoose from 'mongoose';
import { ensureRegistrationIndexes } from '@/features/registrations/services/ensureRegistrationIndexes';
import { getServerEnv } from './env';

let cached = globalThis as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    indexesPromise: Promise<void> | null;
    promise: Promise<typeof mongoose> | null;
  };
};

export async function connectToDatabase() {
  if (cached.mongoose?.conn) {
    cached.mongoose.indexesPromise ||= ensureRegistrationIndexes();
    await cached.mongoose.indexesPromise;

    return cached.mongoose.conn;
  }

  if (!cached.mongoose?.promise) {
    const { MONGODB_URI } = getServerEnv();

    cached.mongoose = {
      conn: null,
      indexesPromise: null,
      promise: mongoose.connect(MONGODB_URI),
    };
  }

  cached.mongoose.conn = await cached.mongoose.promise;
  cached.mongoose.indexesPromise ||= ensureRegistrationIndexes();
  await cached.mongoose.indexesPromise;

  return cached.mongoose.conn;
}
