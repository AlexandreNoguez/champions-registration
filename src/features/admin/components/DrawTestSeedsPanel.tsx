import DataObjectIcon from '@mui/icons-material/DataObject';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useAdminTestSeeds } from '@/features/admin/hooks/useAdminTestSeeds';

type DrawTestSeedsPanelProps = {
  token: string;
};

// Renderiza as ações administrativas para criar e remover seeds de teste.
export function DrawTestSeedsPanel({ token }: DrawTestSeedsPanelProps) {
  const testSeeds = useAdminTestSeeds(token);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 1, p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography component="h3" variant="subtitle1">
            Dados de teste
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Crie 50 inscrições seed distribuídas entre os jogos, com Flaflu em duplas, para simular o chaveamento.
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
  );
}
