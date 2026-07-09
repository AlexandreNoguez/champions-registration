import { Grid, Paper, Typography } from '@mui/material';
import type { AdminRegistrationListResponse } from '@/features/admin/services/listAdminRegistrations';

type TotalsGridProps = {
  data: AdminRegistrationListResponse;
};

// Exibe os totais gerais e por status das inscrições carregadas.
export function TotalsGrid({ data }: TotalsGridProps) {
  const totals = [
    { label: 'Total geral', value: data.totals.total },
    { label: 'Resultado filtrado', value: data.totals.filtered },
    { label: 'Pendentes', value: data.totals.byStatus.pending },
    { label: 'Aprovadas', value: data.totals.byStatus.approved },
    { label: 'Rejeitadas', value: data.totals.byStatus.rejected },
  ];

  return (
    <Grid container spacing={2}>
      {totals.map((total) => (
        <Grid item xs={12} sm={6} md={2.4} key={total.label}>
          <Paper elevation={1} sx={{ borderRadius: 2, p: 2.5, minHeight: 112 }}>
            <Typography variant="body2" color="text.secondary">
              {total.label}
            </Typography>
            <Typography variant="h4" component="p" sx={{ mt: 1 }}>
              {total.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
