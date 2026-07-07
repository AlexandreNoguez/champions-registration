'use client';

import CasinoIcon from '@mui/icons-material/Casino';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import { useAdminDraw } from '@/features/admin/hooks/useAdminDraw';
import { useAdminTestSeeds } from '@/features/admin/hooks/useAdminTestSeeds';
import type { DrawMatch, DrawSlot, GameDraw, WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';

type AdminDrawViewProps = {
  token: string;
};

export function AdminDrawView({ token }: AdminDrawViewProps) {
  const { advanceWinner, generateDraw, loadDraw, state } = useAdminDraw(token);
  const testSeeds = useAdminTestSeeds(token);
  const draw = state.data;

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              Chaveamento mata-mata
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Bracket profissional separado por jogo, com final ao centro e fases nas laterais.
            </Typography>
          </Box>
          <Button
            onClick={loadDraw}
            startIcon={<RefreshIcon />}
            sx={{ minHeight: 44, minWidth: { xs: '100%', md: 170 } }}
            variant="outlined"
          >
            Ver sorteio
          </Button>
          <Button
            onClick={generateDraw}
            startIcon={<CasinoIcon />}
            sx={{ minHeight: 44, minWidth: { xs: '100%', md: 180 } }}
            variant="contained"
          >
            Gerar sorteio
          </Button>
        </Stack>

        <Paper variant="outlined" sx={{ borderRadius: 1, p: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography component="h3" variant="subtitle1">
                Dados de teste
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Crie 50 inscrições seed distribuídas entre os jogos para simular o chaveamento.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <Button
                onClick={testSeeds.createSeeds}
                startIcon={<DataObjectIcon />}
                sx={{ minHeight: 44, minWidth: { xs: '100%', md: 220 } }}
                variant="outlined"
              >
                Adicionar 50 seeds
              </Button>
              <Button
                color="error"
                onClick={testSeeds.deleteSeeds}
                startIcon={<DeleteSweepIcon />}
                sx={{ minHeight: 44, minWidth: { xs: '100%', md: 220 } }}
                variant="outlined"
              >
                Remover seeds
              </Button>
            </Stack>
            {testSeeds.state.status === 'loading' ? (
              <Alert severity="info">Processando seeds de teste...</Alert>
            ) : null}
            {testSeeds.state.status === 'success' ? (
              <Alert severity="success">
                {testSeeds.state.message} Atualize a lista e gere o sorteio para refletir a simulação.
              </Alert>
            ) : null}
            {testSeeds.state.status === 'error' ? (
              <Alert severity="error">{testSeeds.state.error}</Alert>
            ) : null}
          </Stack>
        </Paper>

        {state.status === 'loading' ? (
          <Alert severity="info">Processando sorteio...</Alert>
        ) : null}

        {state.status === 'error' ? (
          <Alert severity="error">{state.error}</Alert>
        ) : null}

        {state.status === 'success' && state.message ? (
          <Alert severity={draw ? 'success' : 'info'}>{state.message}</Alert>
        ) : null}

        {draw ? (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Chip label={`Seed: ${draw.seed}`} />
              <Chip label={`Gerado em ${formatDateTime(draw.generatedAt)}`} />
            </Stack>

            {draw.games.map((gameDraw) => (
              <GameBracket key={gameDraw.game} gameDraw={gameDraw} onAdvanceWinner={advanceWinner} />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}

type GameBracketProps = {
  gameDraw: GameDraw;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
};

function GameBracket({ gameDraw, onAdvanceWinner }: GameBracketProps) {
  const layout = useResponsiveLayout();
  const finalMatch = gameDraw.rounds.at(-1)?.[0] || null;
  const bracketSides = finalMatch ? buildBracketSides(gameDraw, finalMatch) : { left: [], right: [] };
  const sideColumnCount = bracketSides.left.length + bracketSides.right.length;
  const champion = finalMatch?.winner;
  const leftGridColumns = bracketSides.left
    .map(() => `minmax(${layout.bracket.columnMinWidth}px, 1fr)`)
    .join(' ');
  const rightGridColumns = bracketSides.right
    .map(() => `minmax(${layout.bracket.columnMinWidth}px, 1fr)`)
    .join(' ');

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
        <Chip
          label={champion ? `Campeão: ${champion.fullName}` : 'Campeão a definir'}
          sx={{
            bgcolor: champion ? '#ffd966' : 'rgba(255, 255, 255, 0.12)',
            color: champion ? '#32124d' : 'common.white',
            fontWeight: 700,
          }}
        />
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

type BracketColumnData = {
  matches: DrawMatch[];
  roundNumber: number;
};

type BracketColumnProps = {
  column: BracketColumnData;
  gap: number;
  game: TournamentGame;
  minWidth: number;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  side: 'left' | 'right';
  totalRounds: number;
};

function BracketColumn({
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

type FinalStageProps = {
  game: TournamentGame;
  minWidth: number;
  match: DrawMatch;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  totalRounds: number;
};

function FinalStage({ game, minWidth, match, onAdvanceWinner, totalRounds }: FinalStageProps) {
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
        <Typography
          noWrap
          sx={{ color: '#ffd966', fontWeight: 800, maxWidth: '100%' }}
          variant="subtitle2"
        >
          {match.winner ? match.winner.fullName : 'Vencedor'}
        </Typography>
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

type MatchCardProps = {
  game: TournamentGame;
  match: DrawMatch;
  onAdvanceWinner: (game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) => void;
  side: 'left' | 'right' | 'center';
};

function MatchCard({ game, match, onAdvanceWinner, side }: MatchCardProps) {
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
        overflow: 'visible',
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

type MatchSlotProps = {
  isWinner: boolean;
  matchId: string;
  onAdvanceWinner: () => void;
  slot: DrawSlot;
};

function MatchSlot({ isWinner, matchId, onAdvanceWinner, slot }: MatchSlotProps) {
  const isPendingSlot = slot.label === 'A definir';
  const isBye = slot.label === 'BYE';
  const canAdvance = Boolean(slot.participant);
  const primaryText = slot.participant?.fullName || slot.label;
  const secondaryText = slot.participant
    ? `${slot.participant.nickname} - ${slot.participant.className} - chamada ${slot.participant.callNumber}`
    : '';

  return (
    <ButtonBase
      aria-label={canAdvance ? `Avançar ${slot.label} no jogo ${matchId}` : slot.label}
      disabled={!canAdvance}
      onClick={onAdvanceWinner}
      sx={{
        alignItems: 'stretch',
        bgcolor: isWinner ? '#5b0a78' : 'rgba(50, 18, 77, 0.04)',
        border: '1px solid',
        borderColor: isWinner ? '#ffd966' : 'rgba(50, 18, 77, 0.1)',
        borderRadius: 1.5,
        color: isWinner ? 'common.white' : 'text.primary',
        display: 'flex',
        justifyContent: 'flex-start',
        minHeight: 54,
        px: 1.25,
        py: 0.85,
        textAlign: 'left',
        transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
        width: '100%',
        '&:hover': {
          bgcolor: isWinner ? '#3a075f' : 'rgba(91, 10, 120, 0.1)',
          borderColor: isWinner ? '#ffd966' : 'rgba(91, 10, 120, 0.3)',
        },
        '&.Mui-disabled': {
          color: isPendingSlot || isBye ? 'text.secondary' : 'text.primary',
          opacity: 1,
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            variant="body2"
            sx={{
              fontStyle: isPendingSlot ? 'italic' : 'normal',
              fontWeight: isWinner ? 700 : 500,
              lineHeight: 1.2,
            }}
          >
            {primaryText}
          </Typography>
          {slot.participant ? (
            <Typography
              noWrap
              variant="caption"
              sx={{ color: isWinner ? 'rgba(255, 255, 255, 0.78)' : 'text.secondary' }}
            >
              {secondaryText}
            </Typography>
          ) : null}
        </Box>
        {isWinner ? (
          <Chip
            label="Avançou"
            size="small"
            sx={{ bgcolor: '#ffd966', color: '#32124d', fontWeight: 700 }}
          />
        ) : null}
      </Stack>
    </ButtonBase>
  );
}

function buildBracketSides(gameDraw: GameDraw, finalMatch: DrawMatch) {
  const left = buildSideColumns(gameDraw, finalMatch.slotA.sourceMatchId);
  const right = buildSideColumns(gameDraw, finalMatch.slotB.sourceMatchId).reverse();

  return {
    left,
    right,
  };
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

function getRoundLabel(roundNumber: number, totalRounds: number) {
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
