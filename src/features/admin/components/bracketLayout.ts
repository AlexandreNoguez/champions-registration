import type { DrawMatch, GameDraw } from '@/features/draws/domain';

export type BracketColumnData = {
  matches: DrawMatch[];
  roundNumber: number;
};

export function buildBracketSides(gameDraw: GameDraw, finalMatch: DrawMatch) {
  const left = buildSideColumns(gameDraw, finalMatch.slotA.sourceMatchId);
  const right = buildSideColumns(gameDraw, finalMatch.slotB.sourceMatchId).reverse();

  return {
    left,
    right,
  };
}

export function getRoundLabel(roundNumber: number, totalRounds: number) {
  const roundsUntilFinal = totalRounds - roundNumber;

  if (roundsUntilFinal === 0) {
    return 'Final';
  }

  if (roundsUntilFinal === 1) {
    return 'Semifinal';
  }

  if (roundsUntilFinal === 2) {
    return 'Quartas de final';
  }

  if (roundsUntilFinal === 3) {
    return 'Oitavas de final';
  }

  if (roundsUntilFinal === 4) {
    return '16 avos de final';
  }

  return `${2 ** roundsUntilFinal} avos de final`;
}

function buildSideColumns(gameDraw: GameDraw, sourceMatchId?: string) {
  if (!sourceMatchId) {
    return [];
  }

  const matchIds = collectSourceMatchIds(gameDraw, sourceMatchId);

  return gameDraw.rounds
    .slice(0, -1)
    .map((round, index) => ({
      matches: round.filter((match) => matchIds.has(match.id)),
      roundNumber: index + 1,
    }))
    .filter((column) => column.matches.length > 0);
}

function collectSourceMatchIds(gameDraw: GameDraw, rootMatchId: string) {
  const matchById = new Map(gameDraw.rounds.flat().map((match) => [match.id, match]));
  const matchIds = new Set<string>();
  const pendingMatchIds = [rootMatchId];

  while (pendingMatchIds.length > 0) {
    const matchId = pendingMatchIds.pop();

    if (!matchId || matchIds.has(matchId)) {
      continue;
    }

    matchIds.add(matchId);

    const match = matchById.get(matchId);

    if (!match) {
      continue;
    }

    if (match.slotA.sourceMatchId) {
      pendingMatchIds.push(match.slotA.sourceMatchId);
    }

    if (match.slotB.sourceMatchId) {
      pendingMatchIds.push(match.slotB.sourceMatchId);
    }
  }

  return matchIds;
}
