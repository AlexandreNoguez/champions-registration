import { Box, Stack, Typography } from '@mui/material';
import type { WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';
import type { BracketColumnData } from './bracketLayout';
import { getRoundLabel } from './bracketLayout';
import { MatchCard } from './MatchCard';

type BracketColumnProps = {
  column: BracketColumnData;
  gap: number;
  game: TournamentGame;
  minWidth: number;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  side: 'left' | 'right';
  totalRounds: number;
};

// Renderiza uma coluna lateral de rodadas do chaveamento.
export function BracketColumn({
  column,
  gap,
  game,
  minWidth,
  onAdvanceWinner,
  side,
  totalRounds,
}: BracketColumnProps) {
  return (
    <Box sx={{ minWidth: { xs: '100%', lg: minWidth }, width: '100%' }}>
      <Stack spacing={0.5} alignItems={side === 'left' ? 'flex-start' : 'flex-end'} sx={{ mb: 1.5 }}>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.92)', fontWeight: 800 }} variant="subtitle2">
          {getRoundLabel(column.roundNumber, totalRounds)}
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.62)' }} variant="caption">
          {column.matches.length} jogos
        </Typography>
      </Stack>
      <Stack sx={{ gap }}>
        {column.matches.map((match) => (
          <MatchCard
            key={match.id}
            game={game}
            match={match}
            onAdvanceWinner={onAdvanceWinner}
            side={side}
          />
        ))}
      </Stack>
    </Box>
  );
}
