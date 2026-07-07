'use client';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type {
  AdminRegistration,
  AdminRegistrationFilters,
  AdminRegistrationListResponse,
} from '@/features/admin/services/listAdminRegistrations';
import { useAdminRegistrations } from '@/features/admin/hooks/useAdminRegistrations';
import { AdminDrawView } from '@/features/admin/components/AdminDrawView';
import type { RegistrationStatus } from '@/features/registrations/domain';

const statusLabels: Record<RegistrationStatus, string> = {
  approved: 'Aprovada',
  pending: 'Pendente',
  rejected: 'Rejeitada',
};

const statusColors: Record<RegistrationStatus, 'default' | 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
};

export function AdminRegistrationsView() {
  const {
    clearFilters,
    filters,
    loadRegistrations,
    state,
    token,
    updateFilter,
    updateToken,
  } = useAdminRegistrations();
  const data = state.data;
  const filterOptions = data?.filterOptions;

  function handleFilterChange(name: keyof AdminRegistrationFilters) {
    return (event: SelectChangeEvent) => updateFilter(name, event.target.value);
  }

  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'grey.100',
        minHeight: '100vh',
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="primary">
              Organização
            </Typography>
            <Typography variant="h3" component="h1">
              Painel de inscrições
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
              Consulte participantes, acompanhe totais e filtre a lista do torneio.
            </Typography>
          </Box>

          <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2.5, sm: 3 } }}>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <TextField
                  fullWidth
                  label="Token administrativo"
                  onChange={(event) => updateToken(event.target.value)}
                  type="password"
                  value={token}
                />
                <Button
                  onClick={loadRegistrations}
                  size="large"
                  startIcon={<AdminPanelSettingsIcon />}
                  sx={{ minHeight: 48, minWidth: { xs: '100%', md: 180 } }}
                  variant="contained"
                >
                  Acessar
                </Button>
                <Button
                  onClick={loadRegistrations}
                  size="large"
                  startIcon={<RefreshIcon />}
                  sx={{ minHeight: 48, minWidth: { xs: '100%', md: 150 } }}
                  variant="outlined"
                >
                  Atualizar
                </Button>
              </Stack>

              {state.status === 'error' ? (
                <Alert severity="error">{state.error}</Alert>
              ) : null}

              {state.status === 'loading' ? (
                <Alert severity="info">Carregando inscrições...</Alert>
              ) : null}
            </Stack>
          </Paper>

          {data ? (
            <>
              <TotalsGrid data={data} />
              <AdminDrawView token={token} />

              <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2.5, sm: 3 } }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <FilterSelect
                      label="Turma"
                      name="className"
                      onChange={handleFilterChange('className')}
                      options={filterOptions?.classNames || []}
                      value={filters.className || ''}
                    />
                    <FilterSelect
                      label="Ano escolar"
                      name="schoolYear"
                      onChange={handleFilterChange('schoolYear')}
                      options={filterOptions?.schoolYears || []}
                      value={filters.schoolYear || ''}
                    />
                    <FilterSelect
                      label="Jogo"
                      name="preferredGame"
                      onChange={handleFilterChange('preferredGame')}
                      options={filterOptions?.games || []}
                      value={filters.preferredGame || ''}
                    />
                    <FilterSelect
                      getLabel={(status) => statusLabels[status as RegistrationStatus] || status}
                      label="Status"
                      name="status"
                      onChange={handleFilterChange('status')}
                      options={filterOptions?.statuses || []}
                      value={filters.status || ''}
                    />
                    <Button
                      onClick={clearFilters}
                      startIcon={<FilterAltOffIcon />}
                      sx={{ minHeight: 56, minWidth: { xs: '100%', md: 170 } }}
                      variant="outlined"
                    >
                      Limpar
                    </Button>
                    <Button
                      onClick={loadRegistrations}
                      startIcon={<RefreshIcon />}
                      sx={{ minHeight: 56, minWidth: { xs: '100%', md: 150 } }}
                      variant="contained"
                    >
                      Filtrar
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <RegistrationsTable registrations={data.registrations} />
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

type TotalsGridProps = {
  data: AdminRegistrationListResponse;
};

function TotalsGrid({ data }: TotalsGridProps) {
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

type FilterSelectProps = {
  getLabel?: (value: string) => string;
  label: string;
  name: keyof AdminRegistrationFilters;
  onChange: (event: SelectChangeEvent) => void;
  options: string[];
  value: string;
};

function FilterSelect({ getLabel, label, name, onChange, options, value }: FilterSelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id={`${name}-filter-label`}>{label}</InputLabel>
      <Select
        label={label}
        labelId={`${name}-filter-label`}
        onChange={onChange}
        value={value}
      >
        <MenuItem value="">Todos</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {getLabel ? getLabel(option) : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

type RegistrationsTableProps = {
  registrations: AdminRegistration[];
};

function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aluno</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Chamada</TableCell>
              <TableCell>Gamer</TableCell>
              <TableCell>Jogo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Inscrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.length ? (
              registrations.map((registration) => (
                <TableRow key={registration.id} hover>
                  <TableCell>{registration.fullName}</TableCell>
                  <TableCell>{registration.className}</TableCell>
                  <TableCell>{registration.schoolYear}</TableCell>
                  <TableCell>{registration.callNumber}</TableCell>
                  <TableCell>{registration.nickname}</TableCell>
                  <TableCell>{registration.preferredGame}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        color={statusColors[registration.status]}
                        label={statusLabels[registration.status]}
                        size="small"
                      />
                      {registration.isSeedData ? (
                        <Chip color="info" label="Seed" size="small" />
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDateTime(registration.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography color="text.secondary" sx={{ py: 2 }} textAlign="center">
                    Nenhuma inscrição encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
