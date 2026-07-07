import type { TournamentGame } from '@/features/registrations/domain';
import type { DrawMatch, DrawParticipant, GameDraw } from './draw.types';

export function buildSingleEliminationDraw(
  game: TournamentGame,
  participants: DrawParticipant[],
  seed: string
): GameDraw {
  const shuffledParticipants = shuffleParticipants(participants, `${seed}:${game}`);
  const bracketSize = getNextPowerOfTwo(Math.max(shuffledParticipants.length, 2));
  const firstRoundMatches = buildFirstRoundMatches(game, shuffledParticipants, bracketSize);
  const rounds: DrawMatch[][] = [firstRoundMatches];

  let previousRound = firstRoundMatches;
  let round = 2;

  while (previousRound.length > 1) {
    const currentRound = buildNextRoundMatches(game, previousRound, round);
    rounds.push(currentRound);
    previousRound = currentRound;
    round += 1;
  }

  return {
    game,
    participantCount: participants.length,
    rounds,
  };
}

function buildFirstRoundMatches(
  game: TournamentGame,
  participants: DrawParticipant[],
  bracketSize: number
) {
  const slots = [
    ...participants.map((participant) => ({
      label: getParticipantLabel(participant),
      participant,
    })),
    ...Array.from({ length: bracketSize - participants.length }, () => ({
      label: 'BYE',
    })),
  ];

  return Array.from({ length: bracketSize / 2 }, (_, index): DrawMatch => {
    const slotA = slots[index * 2];
    const slotB = slots[index * 2 + 1];

    return {
      id: buildMatchId(game, 1, index + 1),
      round: 1,
      position: index + 1,
      slotA,
      slotB,
      hasBye: slotA.label === 'BYE' || slotB.label === 'BYE',
    };
  });
}

function buildNextRoundMatches(
  game: TournamentGame,
  previousRound: DrawMatch[],
  round: number
) {
  return Array.from({ length: previousRound.length / 2 }, (_, index): DrawMatch => {
    const firstSourceMatch = previousRound[index * 2];
    const secondSourceMatch = previousRound[index * 2 + 1];

    return {
      id: buildMatchId(game, round, index + 1),
      round,
      position: index + 1,
      slotA: {
        label: `Vencedor ${firstSourceMatch.id}`,
        sourceMatchId: firstSourceMatch.id,
      },
      slotB: {
        label: `Vencedor ${secondSourceMatch.id}`,
        sourceMatchId: secondSourceMatch.id,
      },
      hasBye: false,
    };
  });
}

function getNextPowerOfTwo(value: number) {
  let power = 1;

  while (power < value) {
    power *= 2;
  }

  return power;
}

function shuffleParticipants(participants: DrawParticipant[], seed: string) {
  const random = createSeededRandom(seed);
  const shuffledParticipants = [...participants];

  for (let index = shuffledParticipants.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [shuffledParticipants[index], shuffledParticipants[targetIndex]] = [
      shuffledParticipants[targetIndex],
      shuffledParticipants[index],
    ];
  }

  return shuffledParticipants;
}

function createSeededRandom(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMatchId(game: TournamentGame, round: number, position: number) {
  const gameSlug = game
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase();

  return `${gameSlug}-R${round}-J${position}`;
}

function getParticipantLabel(participant: DrawParticipant) {
  return `${participant.nickname} (${participant.fullName})`;
}
