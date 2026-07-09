'use client';

import { useState, type SyntheticEvent } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import type {
  AdminRegistrationFilters,
} from '@/features/admin/services/listAdminRegistrations';
import { useAdminRegistrations } from '@/features/admin/hooks/useAdminRegistrations';
import { AdminDrawView } from '@/features/admin/components/AdminDrawView';
import { AdminTabs, type AdminTabValue } from './AdminTabs';
import { FilterSelect } from './FilterSelect';
import { RegistrationsTable } from './RegistrationsTable';
import { TotalsGrid } from './TotalsGrid';
import { statusLabels } from './registrationStatusDisplay';
import type { RegistrationStatus } from '@/features/registrations/domain';

// Renderiza a tela administrativa de inscrições e chaveamentos.
export function AdminRegistrationsView() {
  const layout = useResponsiveLayout();
  const [activeTab, setActiveTab] = useState<AdminTabValue>('registrations');
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

  function handleTabChange(_: SyntheticEvent, value: AdminTabValue) {
    setActiveTab(value);
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
      <Box
        sx={{
          mx: 'auto',
          maxWidth: layout.admin.contentMaxWidth,
          px: layout.admin.horizontalPadding,
          width: '100%',
        }}
      >
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
              <AdminTabs activeTab={activeTab} onChange={handleTabChange} />

              {activeTab === 'registrations' ? (
                <>
                  <TotalsGrid data={data} />

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
              ) : (
                <AdminDrawView selectedGame={activeTab} token={token} />
              )}
            </>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
