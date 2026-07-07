'use client';

import HowToRegIcon from '@mui/icons-material/HowToReg';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { FormEvent, ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RegistrationInput } from '@/features/registrations/domain';
import { useRegistrationForm } from '@/features/registrations/hooks/useRegistrationForm';
import { useRegistrationStatus } from '@/features/registrations/hooks/useRegistrationStatus';

const schoolYearOptions = [
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
];

const platformOptions = [
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'PC',
  'Celular',
  'Outra',
];

type FieldName = Exclude<keyof RegistrationInput, 'consent'>;

type RegistrationTextField = {
  name: FieldName;
  label: string;
  helperText?: string;
  autoComplete?: string;
};

const identityFields: RegistrationTextField[] = [
  {
    name: 'fullName',
    label: 'Nome completo',
    autoComplete: 'name',
  },
  {
    name: 'callNumber',
    label: 'Número da chamada',
    helperText: 'Use o mesmo número da lista oficial da turma.',
  },
  {
    name: 'className',
    label: 'Turma',
    helperText: 'Exemplo: 7A',
  },
];

const gameFields: RegistrationTextField[] = [
  {
    name: 'nickname',
    label: 'Apelido ou nome de gamer',
  },
  {
    name: 'preferredGame',
    label: 'Jogo preferido',
  },
  {
    name: 'responsibleContact',
    label: 'Contato do responsável',
    helperText: 'Telefone, e-mail ou outro contato combinado com a escola.',
    autoComplete: 'tel',
  },
];

export function RegistrationForm() {
  const { form, submissionState, submitRegistration } = useRegistrationForm();
  const registrationStatus = useRegistrationStatus();
  const {
    control,
    formState: { errors, isSubmitting },
    register,
  } = form;
  const isRegistrationBlocked =
    registrationStatus.status === 'success' && !registrationStatus.data.isOpen;

  function preventBlockedSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Paper
      elevation={2}
      component="form"
      noValidate
      onSubmit={isRegistrationBlocked ? preventBlockedSubmission : submitRegistration}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SportsEsportsIcon fontSize="large" />
          <Box>
            <Typography component="h1" variant="h4">
              Champions Form
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Inscrição para o torneio de videogames
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stack spacing={4} sx={{ p: { xs: 3, sm: 4 } }}>
        <RegistrationStatusNotice state={registrationStatus} />

        {submissionState.status !== 'idle' ? (
          <Alert severity={submissionState.status === 'success' ? 'success' : 'error'}>
            {submissionState.message}
          </Alert>
        ) : null}

        <FormSection
          title="Dados do aluno"
          description="Informe os dados usados pela organização para identificar a inscrição."
        >
          <ResponsiveFieldGrid>
            {identityFields.map((field) => (
              <RegistrationTextInput
                key={field.name}
                field={field}
                errors={errors}
                isDisabled={isRegistrationBlocked}
                register={register}
              />
            ))}
            <SchoolYearSelect control={control} errors={errors} isDisabled={isRegistrationBlocked} />
          </ResponsiveFieldGrid>
        </FormSection>

        <FormSection
          title="Preferências de jogo"
          description="Essas informações ajudam a organizar partidas e comunicação."
        >
          <ResponsiveFieldGrid>
            {gameFields.map((field) => (
              <RegistrationTextInput
                key={field.name}
                field={field}
                errors={errors}
                isDisabled={isRegistrationBlocked}
                register={register}
              />
            ))}
            <PlatformSelect control={control} errors={errors} isDisabled={isRegistrationBlocked} />
          </ResponsiveFieldGrid>
        </FormSection>

        <ConsentControl control={control} errors={errors} isDisabled={isRegistrationBlocked} />

        <Box>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<HowToRegIcon />}
            disabled={isSubmitting || isRegistrationBlocked}
            sx={{
              minWidth: { xs: '100%', sm: 220 },
              minHeight: 48,
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar inscrição'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

type RegistrationStatusNoticeProps = {
  state: ReturnType<typeof useRegistrationStatus>;
};

function RegistrationStatusNotice({ state }: RegistrationStatusNoticeProps) {
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

type FormSectionProps = {
  children: ReactNode;
  description: string;
  title: string;
};

function FormSection({ children, description, title }: FormSectionProps) {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {children}
    </Stack>
  );
}

function ResponsiveFieldGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
        },
      }}
    >
      {children}
    </Box>
  );
}

type RegistrationTextInputProps = {
  errors: FieldErrors<RegistrationInput>;
  field: RegistrationTextField;
  isDisabled: boolean;
  register: UseFormRegister<RegistrationInput>;
};

function RegistrationTextInput({
  errors,
  field,
  isDisabled,
  register,
}: RegistrationTextInputProps) {
  const errorMessage = errors[field.name]?.message;

  return (
    <TextField
      {...register(field.name)}
      autoComplete={field.autoComplete}
      disabled={isDisabled}
      error={Boolean(errorMessage)}
      fullWidth
      helperText={errorMessage || field.helperText || ' '}
      label={field.label}
      variant="outlined"
    />
  );
}

type SelectControlProps = {
  control: Control<RegistrationInput>;
  errors: FieldErrors<RegistrationInput>;
  isDisabled: boolean;
};

function SchoolYearSelect({ control, errors, isDisabled }: SelectControlProps) {
  return (
    <Controller
      control={control}
      name="schoolYear"
      render={({ field }) => {
        const errorMessage = errors.schoolYear?.message;

        return (
          <FormControl fullWidth error={Boolean(errorMessage)}>
            <InputLabel id="school-year-label">Ano escolar</InputLabel>
            <Select
              {...field}
              disabled={isDisabled}
              label="Ano escolar"
              labelId="school-year-label"
            >
              {schoolYearOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errorMessage || ' '}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

function PlatformSelect({ control, errors, isDisabled }: SelectControlProps) {
  return (
    <Controller
      control={control}
      name="platform"
      render={({ field }) => {
        const errorMessage = errors.platform?.message;

        return (
          <FormControl fullWidth error={Boolean(errorMessage)}>
            <InputLabel id="platform-label">Plataforma</InputLabel>
            <Select
              {...field}
              disabled={isDisabled}
              label="Plataforma"
              labelId="platform-label"
            >
              {platformOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errorMessage || ' '}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}

type ConsentControlProps = {
  control: Control<RegistrationInput>;
  errors: FieldErrors<RegistrationInput>;
  isDisabled: boolean;
};

function ConsentControl({ control, errors, isDisabled }: ConsentControlProps) {
  const errorMessage = errors.consent?.message;

  return (
    <FormControl error={Boolean(errorMessage)}>
      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                disabled={isDisabled}
                inputRef={field.ref}
                name={field.name}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
            label="Confirmo que o aluno tem autorização para participar do torneio."
          />
        )}
      />
      <FormHelperText>{errorMessage || ' '}</FormHelperText>
    </FormControl>
  );
}
