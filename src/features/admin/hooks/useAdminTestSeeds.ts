'use client';

import { useState } from 'react';

type TestSeedState = {
  error: string;
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
};

export function useAdminTestSeeds(token: string) {
  const [state, setState] = useState<TestSeedState>({
    error: '',
    message: '',
    status: 'idle',
  });

  async function createSeeds() {
    await requestSeeds('POST');
  }

  async function deleteSeeds() {
    await requestSeeds('DELETE');
  }

  async function requestSeeds(method: 'POST' | 'DELETE') {
    if (!token.trim()) {
      setState({
        error: 'Informe o token administrativo.',
        message: '',
        status: 'error',
      });
      return;
    }

    setState({
      error: '',
      message: '',
      status: 'loading',
    });

    try {
      const response = await fetch('/api/admin/test-seeds', {
        method,
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setState({
          error: data.message || 'Não foi possível processar as seeds.',
          message: '',
          status: 'error',
        });
        return;
      }

      setState({
        error: '',
        message: data.message || 'Operação concluída.',
        status: 'success',
      });
    } catch {
      setState({
        error: 'Não foi possível conectar ao servidor.',
        message: '',
        status: 'error',
      });
    }
  }

  return {
    createSeeds,
    deleteSeeds,
    state,
  };
}
