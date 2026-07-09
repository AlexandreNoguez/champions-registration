import { Alert, Chip, Stack, Typography } from '@mui/material';
import { useRegistrationStatus } from '@/features/registrations/hooks/useRegistrationStatus';

type RegistrationStatusNoticeProps = {
  state: ReturnType<typeof useRegistrationStatus>;
};

// Exibe o status atual do período de inscrições no topo do formulário.
export function RegistrationStatusNotice({ state }: RegistrationStatusNoticeProps) {
  if (state.status === 'loading') {
    return (
      <Alert severity="info">
        Consultando status das inscrições...
      </Alert>
    );
  }

  if (state.status === 'error') {
    return (
      <Alert severity="warning">
        {state.error} O envio ainda será validado pelo servidor.
      </Alert>
    );
  }

  const { data } = state;
  const periodText = getRegistrationPeriodText(data);

  return (
    <Alert
      severity={data.isOpen ? 'success' : 'warning'}
      icon={false}
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
      >
        <Chip
          color={data.isOpen ? 'success' : 'warning'}
          label={data.isOpen ? 'Aberta' : 'Encerrada'}
          size="small"
        />
        <Typography variant="body2">
          {data.message}
          {periodText ? ` ${periodText}` : ''}
        </Typography>
      </Stack>
    </Alert>
  );
}

type RegistrationStatusData = NonNullable<ReturnType<typeof useRegistrationStatus>['data']>;

function getRegistrationPeriodText(status: RegistrationStatusData) {
  if (status.status === 'open' && status.closesAt) {
    return `Encerramento previsto em ${formatDateTime(status.closesAt)}.`;
  }

  if (status.status === 'not_started' && status.opensAt) {
    return `Abertura prevista em ${formatDateTime(status.opensAt)}.`;
  }

  if (status.status === 'closed' && status.closesAt) {
    return `O prazo terminou em ${formatDateTime(status.closesAt)}.`;
  }

  return '';
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
