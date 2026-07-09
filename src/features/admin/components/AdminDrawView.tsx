'use client';

import CasinoIcon from '@mui/icons-material/Casino';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useAdminDraw } from '@/features/admin/hooks/useAdminDraw';
import type { TournamentGame } from '@/features/registrations/domain';
import { DrawTestSeedsPanel } from './DrawTestSeedsPanel';
import { GameBracket } from './GameBracket';
import { formatDateTime } from './dateFormat';

type AdminDrawViewProps = {
  selectedGame?: TournamentGame;
  token: string;
};

// Renderiza a tela administrativa de geração e acompanhamento do sorteio.
export function AdminDrawView({ selectedGame, token }: AdminDrawViewProps) {
  const { advanceWinner, generateDraw, loadDraw, state } = useAdminDraw(token);
  const draw = state.data;
  const displayedGames = selectedGame
    ? draw?.games.filter((gameDraw) => gameDraw.game === selectedGame)
    : draw?.games;

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {selectedGame ? `Chaveamento ${selectedGame}` : 'Chaveamento mata-mata'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {selectedGame
                ? 'Acompanhe a chave deste jogo e avance vencedores clicando nos competidores.'
                : 'Bracket profissional separado por jogo, com final ao centro e fases nas laterais.'}
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

        <DrawTestSeedsPanel token={token} />

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

            {displayedGames?.map((gameDraw) => (
              <GameBracket key={gameDraw.game} gameDraw={gameDraw} onAdvanceWinner={advanceWinner} />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
