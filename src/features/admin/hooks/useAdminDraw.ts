'use client';

import { useState } from 'react';
import type { SerializedDraw } from '@/features/draws/services/draw.service';

type AdminDrawState =
  | {
      data: SerializedDraw | null;
      error: null;
      message: string;
      status: 'idle' | 'loading' | 'success';
    }
  | {
      data: null;
      error: string;
      message: string;
      status: 'error';
    };

export function useAdminDraw(token: string) {
  const [state, setState] = useState<AdminDrawState>({
    data: null,
    error: null,
    message: '',
    status: 'idle',
  });

  async function loadDraw() {
    await requestDraw('GET');
  }

  async function generateDraw() {
    await requestDraw('POST');
  }

  async function requestDraw(method: 'GET' | 'POST') {
    if (!token.trim()) {
      setState({
        data: null,
        error: 'Informe o token administrativo.',
        message: '',
        status: 'error',
      });
      return;
    }

    setState((currentState) => ({
      data: currentState.data,
      error: null,
      message: '',
      status: 'loading',
    }));

    try {
      const response = await fetch('/api/admin/draws', {
        method,
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setState({
          data: null,
          error: data.message || 'Não foi possível consultar o sorteio.',
          message: '',
          status: 'error',
        });
        return;
      }

      setState({
        data: data.draw,
        error: null,
        message: data.message || (data.draw ? 'Sorteio carregado.' : 'Nenhum sorteio gerado ainda.'),
        status: 'success',
      });
    } catch {
      setState({
        data: null,
        error: 'Não foi possível conectar ao servidor.',
        message: '',
        status: 'error',
      });
    }
  }

  return {
    generateDraw,
    loadDraw,
    state,
  };
}
