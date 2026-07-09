'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  registrationInputSchema,
  type RegistrationInput,
} from '@/features/registrations/domain';

type ApiRegistrationErrorResponse = {
  message?: string;
  errors?: Partial<Record<keyof RegistrationInput, string[]>>;
};

type SubmissionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

const defaultValues: RegistrationInput = {
  fullName: '',
  callNumber: '',
  className: '',
  schoolYear: '',
  nickname: '',
  preferredGame: 'FC26',
  partnerFullName: '',
  partnerCallNumber: '',
  partnerClassName: '',
  partnerSchoolYear: '',
  partnerNickname: '',
};

export function useRegistrationForm() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: 'idle',
    message: '',
  });

  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationInputSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const submitRegistration = form.handleSubmit(async (values) => {
    setSubmissionState({ status: 'idle', message: '' });

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => ({}))) as ApiRegistrationErrorResponse;

      if (!response.ok) {
        applyServerErrors(data.errors);

        setSubmissionState({
          status: 'error',
          message: data.message || 'Não foi possível concluir a inscrição. Tente novamente.',
        });
        return;
      }

      form.reset(defaultValues);
      setSubmissionState({
        status: 'success',
        message: data.message || 'Inscrição realizada com sucesso.',
      });
    } catch {
      setSubmissionState({
        status: 'error',
        message: 'Não foi possível conectar ao servidor. Tente novamente em instantes.',
      });
    }
  });

  function applyServerErrors(errors?: ApiRegistrationErrorResponse['errors']) {
    if (!errors) {
      return;
    }

    Object.entries(errors).forEach(([fieldName, messages]) => {
      if (!messages?.length) {
        return;
      }

      form.setError(fieldName as keyof RegistrationInput, {
        type: 'server',
        message: messages.join(' '),
      });
    });
  }

  return {
    form,
    submissionState,
    submitRegistration,
  };
}
