'use client';

import { useEffect, useState } from 'react';
import type { SerializedRegistrationPeriodStatus } from '@/features/registrations/services/getRegistrationStatus';

type RegistrationStatusState =
  | {
      data: null;
      error: null;
      status: 'loading';
    }
  | {
      data: SerializedRegistrationPeriodStatus;
      error: null;
      status: 'success';
    }
  | {
      data: null;
      error: string;
      status: 'error';
    };

export function useRegistrationStatus() {
  const [state, setState] = useState<RegistrationStatusState>({
    data: null,
    error: null,
    status: 'loading',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const response = await fetch('/api/registrations/status');
        const data = (await response.json()) as SerializedRegistrationPeriodStatus;

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          setState({
            data: null,
            error: 'Não foi possível consultar o status das inscrições.',
            status: 'error',
          });
          return;
        }

        setState({
          data,
          error: null,
          status: 'success',
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setState({
          data: null,
          error: 'Não foi possível consultar o status das inscrições.',
          status: 'error',
        });
      }
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
