import type { RegistrationStatus } from '@/features/registrations/domain';

export const statusLabels: Record<RegistrationStatus, string> = {
  approved: 'Aprovada',
  pending: 'Pendente',
  rejected: 'Rejeitada',
};

export const statusColors: Record<RegistrationStatus, 'default' | 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
};
