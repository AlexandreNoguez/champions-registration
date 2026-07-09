import { Box, Chip, Stack } from '@mui/material';
import type { DrawMatch, WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';
import { MatchSlot } from './MatchSlot';

type MatchCardProps = {
  game: TournamentGame;
  match: DrawMatch;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  side: 'left' | 'right' | 'center';
};

// Renderiza um confronto com seus dois slots de competidores.
export function MatchCard({ game, match, onAdvanceWinner, side }: MatchCardProps) {
  const lineSide = side === 'left' ? 'right' : 'left';

  return (
    <Box
      sx={{
        bgcolor: 'rgba(255, 255, 255, 0.94)',
        border: '1px solid',
        borderColor: match.winner ? '#ffd966' : 'rgba(255, 255, 255, 0.34)',
        borderRadius: 2,
        boxShadow: match.winner
          ? '0 10px 22px rgba(255, 217, 102, 0.2)'
          : '0 12px 26px rgba(32, 7, 51, 0.2)',
        color: 'text.primary',
        overflow: 'hidden',
        position: 'relative',
        '&::after': {
          borderTop: '2px solid rgba(255, 217, 102, 0.62)',
          content: side === 'center' ? 'none' : '""',
          position: 'absolute',
          top: '50%',
          width: 22,
          [lineSide]: -22,
        },
      }}
    >
      <Stack spacing={0.75} sx={{ p: 0.75 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Chip
            label={match.id.split('-').slice(-2).join(' ')}
            size="small"
            sx={{
              bgcolor: 'rgba(91, 10, 120, 0.1)',
              color: '#5b0a78',
              fontWeight: 700,
              height: 22,
            }}
          />
          {match.hasBye ? (
            <Chip color="warning" label="BYE" size="small" sx={{ height: 22 }} />
          ) : null}
        </Stack>
        <MatchSlot
          isWinner={match.winnerSlot === 'slotA'}
          matchId={match.id}
          onAdvanceWinner={() => onAdvanceWinner(game, match.id, 'slotA')}
          slot={match.slotA}
        />
        <MatchSlot
          isWinner={match.winnerSlot === 'slotB'}
          matchId={match.id}
          onAdvanceWinner={() => onAdvanceWinner(game, match.id, 'slotB')}
          slot={match.slotB}
        />
      </Stack>
    </Box>
  );
}
