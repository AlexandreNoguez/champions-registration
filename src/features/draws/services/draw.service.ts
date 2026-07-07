import { randomBytes } from 'crypto';
import {
  buildSingleEliminationDraw,
  type DrawParticipant,
  type GameDraw,
} from '@/features/draws/domain';
import { tournamentGameValues, type TournamentGame } from '@/features/registrations/domain';
import { DrawModel, type DrawDocument } from '@/models/Draw';
import { RegistrationModel } from '@/models/Registration';

export type SerializedDraw = {
  seed: string;
  games: GameDraw[];
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
};

const validDrawStatuses = ['pending', 'approved'];

export async function generateDraw() {
  const seed = randomBytes(16).toString('hex');
  const participantsByGame = await getParticipantsByGame();
  const games = tournamentGameValues.map((game) =>
    buildSingleEliminationDraw(game, participantsByGame[game], seed)
  );

  const draw = await DrawModel.findOneAndUpdate(
    { key: 'current' },
    {
      key: 'current',
      seed,
      games,
      generatedAt: new Date(),
    },
    {
      new: true,
      upsert: true,
    }
  ).exec();

  return serializeDraw(draw);
}

export async function getCurrentDraw() {
  const draw = await DrawModel.findOne({ key: 'current' }).exec();
  return draw ? serializeDraw(draw) : null;
}

async function getParticipantsByGame() {
  const registrations = await RegistrationModel.find({
    preferredGame: { $in: tournamentGameValues },
    status: { $in: validDrawStatuses },
  })
    .sort({ preferredGame: 1, className: 1, callNumber: 1 })
    .exec();

  const participantsByGame = tournamentGameValues.reduce(
    (accumulator, game) => ({
      ...accumulator,
      [game]: [],
    }),
    {} as Record<TournamentGame, DrawParticipant[]>
  );

  registrations.forEach((registration) => {
    const game = registration.preferredGame as TournamentGame;

    participantsByGame[game].push({
      registrationId: String(registration._id),
      fullName: registration.fullName,
      callNumber: registration.callNumber,
      className: registration.className,
      schoolYear: registration.schoolYear,
      nickname: registration.nickname,
    });
  });

  return participantsByGame;
}

function serializeDraw(draw: DrawDocument & { _id: unknown }): SerializedDraw {
  return {
    seed: draw.seed,
    games: draw.games,
    generatedAt: draw.generatedAt.toISOString(),
    createdAt: draw.createdAt.toISOString(),
    updatedAt: draw.updatedAt.toISOString(),
  };
}
