'use client';

import HowToRegIcon from '@mui/icons-material/HowToReg';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import type { FormEvent } from 'react';
import { isTeamTournamentGame } from '@/features/registrations/domain';
import { useRegistrationForm } from '@/features/registrations/hooks/useRegistrationForm';
import { useRegistrationStatus } from '@/features/registrations/hooks/useRegistrationStatus';
import { FormSection } from './FormSection';
import { PreferredGameSelect } from './PreferredGameSelect';
import { RegistrationStatusNotice } from './RegistrationStatusNotice';
import { RegistrationTextInput } from './RegistrationTextInput';
import { ResponsiveFieldGrid } from './ResponsiveFieldGrid';
import { SchoolYearSelect } from './SchoolYearSelect';
import { gameFields, identityFields, partnerFields } from './registrationFormFields';

// Renderiza o formulário público de inscrição do torneio.
export function RegistrationForm() {
  const { form, submissionState, submitRegistration } = useRegistrationForm();
  const registrationStatus = useRegistrationStatus();
  const {
    control,
    formState: { errors, isSubmitting },
    register,
    watch,
  } = form;
  const selectedGame = watch('preferredGame');
  const isTeamGameRegistration = isTeamTournamentGame(selectedGame);
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
            <SchoolYearSelect
              control={control}
              errors={errors}
              isDisabled={isRegistrationBlocked}
              label="Ano escolar"
              name="schoolYear"
            />
          </ResponsiveFieldGrid>
        </FormSection>

        <FormSection
          title="Modalidade"
          description="Escolha o jogo em que o aluno vai competir; o sorteio será separado por jogo."
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
            <PreferredGameSelect control={control} errors={errors} isDisabled={isRegistrationBlocked} />
          </ResponsiveFieldGrid>
        </FormSection>

        {isTeamGameRegistration ? (
          <FormSection
            title="Dados da dupla"
            description={`Para ${selectedGame}, informe o parceiro que vai competir junto nesta inscrição.`}
          >
            <ResponsiveFieldGrid>
              {partnerFields.map((field) => (
                <RegistrationTextInput
                  key={field.name}
                  field={field}
                  errors={errors}
                  isDisabled={isRegistrationBlocked}
                  register={register}
                />
              ))}
              <SchoolYearSelect
                control={control}
                errors={errors}
                isDisabled={isRegistrationBlocked}
                label="Ano escolar do parceiro"
                name="partnerSchoolYear"
              />
            </ResponsiveFieldGrid>
          </FormSection>
        ) : null}

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
