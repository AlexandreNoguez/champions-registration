'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  AdminRegistrationFilters,
  AdminRegistrationListResponse,
} from '@/features/admin/services/listAdminRegistrations';

type AdminRegistrationsState =
  | {
      data: null;
      error: null;
      status: 'idle' | 'loading';
    }
  | {
      data: AdminRegistrationListResponse;
      error: null;
      status: 'success';
    }
  | {
      data: null;
      error: string;
      status: 'error';
    };

const adminTokenStorageKey = 'champions-form-admin-token';

export function useAdminRegistrations() {
  const [filters, setFilters] = useState<AdminRegistrationFilters>({});
  const [token, setToken] = useState('');
  const [state, setState] = useState<AdminRegistrationsState>({
    data: null,
    error: null,
    status: 'idle',
  });

  const hasToken = token.trim().length > 0;

  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      }
    });

    return searchParams.toString();
  }, [filters]);

  useEffect(() => {
    setToken(window.localStorage.getItem(adminTokenStorageKey) || '');
  }, []);

  function updateToken(value: string) {
    setToken(value);
    window.localStorage.setItem(adminTokenStorageKey, value);
  }

  function updateFilter(name: keyof AdminRegistrationFilters, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value || undefined,
    }));
  }

  function clearFilters() {
    setFilters({});
  }

  async function loadRegistrations() {
    if (!hasToken) {
      setState({
        data: null,
        error: 'Informe o token administrativo.',
        status: 'error',
      });
      return;
    }

    setState({
      data: null,
      error: null,
      status: 'loading',
    });

    try {
      const response = await fetch(`/api/admin/registrations${queryString ? `?${queryString}` : ''}`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        setState({
          data: null,
          error: data.message || 'Não foi possível consultar as inscrições.',
          status: 'error',
        });
        return;
      }

      setState({
        data: data as AdminRegistrationListResponse,
        error: null,
        status: 'success',
      });
    } catch {
      setState({
        data: null,
        error: 'Não foi possível conectar ao servidor.',
        status: 'error',
      });
    }
  }

  return {
    clearFilters,
    filters,
    hasToken,
    loadRegistrations,
    setFilters,
    state,
    token,
    updateFilter,
    updateToken,
  };
}
