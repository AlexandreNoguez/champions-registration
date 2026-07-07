'use client';

import { useState } from 'react';
import type { SerializedDraw } from '@/features/draws/services/draw.service';
import type { WinnerSlot } from '@/features/draws/domain';
import type { TournamentGame } from '@/features/registrations/domain';

type AdminDrawState =
  {
    data: SerializedDraw | null;
    error: string | null;
    message: string;
    status: 'idle' | 'loading' | 'success' | 'error';
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

  async function advanceWinner(game: TournamentGame, matchId: string, winnerSlot: WinnerSlot) {
    await requestDraw('PATCH', {
      game,
      matchId,
      winnerSlot,
    });
  }

  async function requestDraw(method: 'GET' | 'POST' | 'PATCH', payload?: unknown) {
    if (!token.trim()) {
      setState((currentState) => ({
        data: currentState.data,
        error: 'Informe o token administrativo.',
        message: '',
        status: 'error',
      }));
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
          ...(payload ? { 'Content-Type': 'application/json' } : {}),
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await response.json();

      if (!response.ok) {
        setState((currentState) => ({
          data: currentState.data,
          error: data.message || 'Não foi possível consultar o sorteio.',
          message: '',
          status: 'error',
        }));
        return;
      }

      setState({
        data: data.draw,
        error: null,
        message: data.message || (data.draw ? 'Sorteio carregado.' : 'Nenhum sorteio gerado ainda.'),
        status: 'success',
      });
    } catch {
      setState((currentState) => ({
        data: currentState.data,
        error: 'Não foi possível conectar ao servidor.',
        message: '',
        status: 'error',
      }));
    }
  }

  return {
    advanceWinner,
    generateDraw,
    loadDraw,
    state,
  };
}
