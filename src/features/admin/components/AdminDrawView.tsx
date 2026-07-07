'use client';

import CasinoIcon from '@mui/icons-material/Casino';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAdminDraw } from '@/features/admin/hooks/useAdminDraw';
import { useAdminTestSeeds } from '@/features/admin/hooks/useAdminTestSeeds';
import type { DrawMatch, GameDraw } from '@/features/draws/domain';

type AdminDrawViewProps = {
  token: string;
};

export function AdminDrawView({ token }: AdminDrawViewProps) {
  const { generateDraw, loadDraw, state } = useAdminDraw(token);
  const testSeeds = useAdminTestSeeds(token);
  const draw = state.data;

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              Sorteio mata-mata
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Gere chaves separadas por jogo. Cada partida elimina o participante que perder.
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
              <GameBracket key={gameDraw.game} gameDraw={gameDraw} />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}

function GameBracket({ gameDraw }: { gameDraw: GameDraw }) {
  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <Typography component="h3" variant="h6">
          {gameDraw.game}
        </Typography>
        <Chip label={`${gameDraw.participantCount} inscritos`} size="small" />
      </Stack>

      {gameDraw.participantCount < 2 ? (
        <Alert severity="warning">
          Ainda não há participantes suficientes para formar uma partida neste jogo.
        </Alert>
      ) : (
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={2}
          sx={{
            overflowX: 'auto',
            pb: 1,
          }}
        >
          {gameDraw.rounds.map((round, index) => (
            <RoundColumn key={`${gameDraw.game}-${index}`} matches={round} roundNumber={index + 1} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

function RoundColumn({ matches, roundNumber }: { matches: DrawMatch[]; roundNumber: number }) {
  return (
    <Box sx={{ minWidth: { xs: '100%', lg: 280 }, flex: 1 }}>
      <Typography color="text.secondary" variant="subtitle2" sx={{ mb: 1 }}>
        {getRoundLabel(roundNumber)}
      </Typography>
      <Stack spacing={1.5}>
        {matches.map((match) => (
          <Paper key={match.id} variant="outlined" sx={{ borderRadius: 1, p: 1.5 }}>
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {match.id}
              </Typography>
              <MatchSlot label={match.slotA.label} />
              <Divider />
              <MatchSlot label={match.slotB.label} />
              {match.hasBye ? (
                <Chip color="warning" label="Avanço automático" size="small" sx={{ alignSelf: 'flex-start' }} />
              ) : null}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

function MatchSlot({ label }: { label: string }) {
  return (
    <Typography variant="body2" sx={{ minHeight: 24 }}>
      {label}
    </Typography>
  );
}

function getRoundLabel(roundNumber: number) {
  if (roundNumber === 1) {
    return 'Primeira rodada';
  }

  if (roundNumber === 2) {
    return 'Semifinais ou segunda rodada';
  }

  return `Rodada ${roundNumber}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
