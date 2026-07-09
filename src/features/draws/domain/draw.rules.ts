import type { TournamentGame } from '@/features/registrations/domain';
import type { DrawMatch, DrawParticipant, GameDraw } from './draw.types';

export type WinnerSlot = 'slotA' | 'slotB';

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
  const slots = buildBalancedFirstRoundSlots(participants, bracketSize);

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

function buildBalancedFirstRoundSlots(participants: DrawParticipant[], bracketSize: number) {
  const bracketPositions = buildBracketSeedPositions(bracketSize);

  return bracketPositions.map((position) => {
    const participant = participants[position - 1];

    if (!participant) {
      return {
        label: 'BYE',
      };
    }

    return {
      label: getParticipantLabel(participant),
      participant,
    };
  });
}

function buildBracketSeedPositions(bracketSize: number): number[] {
  let positions = [1, 2];

  while (positions.length < bracketSize) {
    const nextSize = positions.length * 2;
    positions = positions.flatMap((position) => [position, nextSize + 1 - position]);
  }

  return positions;
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
        label: 'A definir',
        sourceMatchId: firstSourceMatch.id,
      },
      slotB: {
        label: 'A definir',
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
  if (participant.partner) {
    return `${participant.nickname} + ${participant.partner.nickname}`;
  }

  return `${participant.nickname} (${participant.fullName})`;
}

export function advanceWinnerInGameDraw(
  gameDraw: GameDraw,
  matchId: string,
  winnerSlot: WinnerSlot
): GameDraw {
  const nextGameDraw = cloneGameDraw(gameDraw);
  const match = findMatch(nextGameDraw, matchId);

  if (!match) {
    throw new Error('Match not found');
  }

  const selectedSlot = match[winnerSlot];

  if (!selectedSlot.participant) {
    throw new Error('Selected slot does not have a participant');
  }

  clearDependentResults(nextGameDraw, match.id);

  match.winnerSlot = winnerSlot;
  match.winner = selectedSlot.participant;
  propagateWinnerToNextMatch(nextGameDraw, match.id, selectedSlot.participant);

  return nextGameDraw;
}

function cloneGameDraw(gameDraw: GameDraw) {
  return JSON.parse(JSON.stringify(gameDraw)) as GameDraw;
}

function findMatch(gameDraw: GameDraw, matchId: string) {
  return gameDraw.rounds.flat().find((match) => match.id === matchId);
}

function clearDependentResults(gameDraw: GameDraw, sourceMatchId: string) {
  gameDraw.rounds.flat().forEach((match) => {
    let wasCleared = false;

    if (match.slotA.sourceMatchId === sourceMatchId) {
      match.slotA = {
        label: 'A definir',
        sourceMatchId,
      };
      wasCleared = true;
    }

    if (match.slotB.sourceMatchId === sourceMatchId) {
      match.slotB = {
        label: 'A definir',
        sourceMatchId,
      };
      wasCleared = true;
    }

    if (wasCleared) {
      delete match.winner;
      delete match.winnerSlot;
      clearDependentResults(gameDraw, match.id);
    }
  });
}

function propagateWinnerToNextMatch(
  gameDraw: GameDraw,
  sourceMatchId: string,
  participant: DrawParticipant
) {
  const nextMatch = gameDraw.rounds.flat().find((match) =>
    match.slotA.sourceMatchId === sourceMatchId || match.slotB.sourceMatchId === sourceMatchId
  );

  if (!nextMatch) {
    return;
  }

  const nextSlot = nextMatch.slotA.sourceMatchId === sourceMatchId ? 'slotA' : 'slotB';

  nextMatch[nextSlot] = {
    label: getParticipantLabel(participant),
    participant,
    sourceMatchId,
  };
}
