import mongoose, { Schema, type Model } from 'mongoose';
import { tournamentGameValues } from '@/features/registrations/domain';
import type { GameDraw } from '@/features/draws/domain';

export type DrawDocument = {
  key: 'current';
  seed: string;
  games: GameDraw[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const drawParticipantSchema = new Schema(
  {
    registrationId: { type: String, required: true },
    fullName: { type: String, required: true },
    callNumber: { type: String, required: true },
    className: { type: String, required: true },
    schoolYear: { type: String, required: true },
    nickname: { type: String, required: true },
  },
  { _id: false }
);

const drawSlotSchema = new Schema(
  {
    label: { type: String, required: true },
    participant: { type: drawParticipantSchema, required: false },
    sourceMatchId: { type: String, required: false },
  },
  { _id: false }
);

const drawMatchSchema = new Schema(
  {
    id: { type: String, required: true },
    round: { type: Number, required: true },
    position: { type: Number, required: true },
    slotA: { type: drawSlotSchema, required: true },
    slotB: { type: drawSlotSchema, required: true },
    hasBye: { type: Boolean, required: true },
  },
  { _id: false }
);

const gameDrawSchema = new Schema(
  {
    game: { type: String, enum: tournamentGameValues, required: true },
    participantCount: { type: Number, required: true },
    rounds: { type: [[drawMatchSchema]], required: true },
  },
  { _id: false }
);

const drawSchema = new Schema<DrawDocument>(
  {
    key: { type: String, default: 'current', required: true, unique: true },
    seed: { type: String, required: true },
    games: { type: [gameDrawSchema], required: true },
    generatedAt: { type: Date, required: true },
  },
  {
    collection: 'draws',
    timestamps: true,
  }
);

export const DrawModel =
  (mongoose.models.Draw as Model<DrawDocument> | undefined) ||
  mongoose.model<DrawDocument>('Draw', drawSchema);
