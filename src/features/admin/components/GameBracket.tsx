import { Alert, Box, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { useGameBracketLayout } from '@/features/admin/hooks/useGameBracketLayout';
import type { GameDraw, WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';
import { BracketColumn } from './BracketColumn';
import { FinalStage } from './FinalStage';
import {
  getParticipantDisplayName,
  getParticipantTooltipTitle,
} from './drawParticipantDisplay';

type GameBracketProps = {
  gameDraw: GameDraw;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
};

// Renderiza o bracket completo de uma modalidade do torneio.
export function GameBracket({ gameDraw, onAdvanceWinner }: GameBracketProps) {
  const {
    bracketSides,
    champion,
    finalMatch,
    layout,
    leftGridColumns,
    rightGridColumns,
    sideColumnCount,
  } = useGameBracketLayout(gameDraw);

  return (
    <Box
      sx={{
        background:
          'linear-gradient(135deg, #3a075f 0%, #5b0a78 44%, #81218a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.22)',
        borderRadius: 2,
        boxShadow: '0 18px 42px rgba(58, 7, 95, 0.22)',
        color: 'common.white',
        overflow: 'hidden',
        p: { xs: 2, sm: 2.5 },
        position: 'relative',
      }}
    >
      <Box
        sx={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(255, 213, 102, 0.2), transparent 32%)',
          inset: 0,
          pointerEvents: 'none',
          position: 'absolute',
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ sm: 'center' }}
        sx={{ mb: 2.5, position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography component="h3" variant="h6" sx={{ fontWeight: 800 }}>
            {gameDraw.game}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)' }} variant="body2">
            {gameDraw.participantCount} inscritos
          </Typography>
        </Box>
        <Tooltip title={champion ? getParticipantTooltipTitle(champion) : ''}>
          <Chip
            label={champion ? `Campeão: ${getParticipantDisplayName(champion)}` : 'Campeão a definir'}
            sx={{
              bgcolor: champion ? '#ffd966' : 'rgba(255, 255, 255, 0.12)',
              color: champion ? '#32124d' : 'common.white',
              fontWeight: 700,
            }}
          />
        </Tooltip>
      </Stack>

      {gameDraw.participantCount < 2 ? (
        <Alert severity="warning">
          Ainda não há participantes suficientes para formar uma partida neste jogo.
        </Alert>
      ) : (
        <Box
          sx={{
            overflowX: 'auto',
            pb: 1.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: { xs: 'flex', lg: 'grid' },
              flexDirection: 'column',
              gap: layout.bracket.gap,
              gridTemplateColumns: {
                lg: `${leftGridColumns} minmax(${layout.bracket.finalMinWidth}px, ${layout.bracket.finalMinWidth + 60}px) ${rightGridColumns}`,
              },
              justifyContent: 'center',
              minWidth: layout.bracket.minWidth(sideColumnCount),
            }}
          >
            {bracketSides.left.map((column) => (
              <BracketColumn
                key={`${gameDraw.game}-left-${column.roundNumber}`}
                column={column}
                game={gameDraw.game}
                gap={layout.bracket.getRoundGap(column.roundNumber)}
                minWidth={layout.bracket.columnMinWidth}
                onAdvanceWinner={onAdvanceWinner}
                side="left"
                totalRounds={gameDraw.rounds.length}
              />
            ))}
            {finalMatch ? (
              <FinalStage
                game={gameDraw.game}
                minWidth={layout.bracket.finalMinWidth}
                match={finalMatch}
                onAdvanceWinner={onAdvanceWinner}
                totalRounds={gameDraw.rounds.length}
              />
            ) : null}
            {bracketSides.right.map((column) => (
              <BracketColumn
                key={`${gameDraw.game}-right-${column.roundNumber}`}
                column={column}
                game={gameDraw.game}
                gap={layout.bracket.getRoundGap(column.roundNumber)}
                minWidth={layout.bracket.columnMinWidth}
                onAdvanceWinner={onAdvanceWinner}
                side="right"
                totalRounds={gameDraw.rounds.length}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
