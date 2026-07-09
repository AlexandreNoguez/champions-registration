import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import type { DrawMatch, WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';
import { getRoundLabel } from './bracketLayout';
import {
  getParticipantDisplayName,
  getParticipantTooltipTitle,
} from './drawParticipantDisplay';
import { MatchCard } from './MatchCard';

type FinalStageProps = {
  game: TournamentGame;
  minWidth: number;
  match: DrawMatch;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  totalRounds: number;
};

// Renderiza a etapa final central do bracket e a área do campeão.
export function FinalStage({ game, minWidth, match, onAdvanceWinner, totalRounds }: FinalStageProps) {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      sx={{
        alignSelf: 'stretch',
        justifyContent: 'center',
        minWidth: { xs: '100%', lg: minWidth },
        order: { xs: -1, lg: 'initial' },
        py: { xs: 1, lg: 3 },
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 217, 102, 0.52)',
          borderRadius: 2,
          display: 'flex',
          height: 48,
          justifyContent: 'center',
          px: 2,
          width: 180,
        }}
      >
        <Tooltip title={match.winner ? getParticipantTooltipTitle(match.winner) : ''}>
          <Typography
            noWrap
            sx={{ color: '#ffd966', fontWeight: 800, maxWidth: '100%' }}
            variant="subtitle2"
          >
            {match.winner ? getParticipantDisplayName(match.winner) : 'Vencedor'}
          </Typography>
        </Tooltip>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'linear-gradient(180deg, #ffe28a 0%, #c88a24 100%)',
          borderRadius: '50%',
          boxShadow: '0 18px 34px rgba(0, 0, 0, 0.28)',
          color: '#4d2464',
          display: 'flex',
          height: 104,
          justifyContent: 'center',
          width: 104,
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 68 }} />
      </Box>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.82)', fontWeight: 800 }} variant="subtitle2">
        {getRoundLabel(totalRounds, totalRounds)}
      </Typography>
      <MatchCard game={game} match={match} onAdvanceWinner={onAdvanceWinner} side="center" />
    </Stack>
  );
}
