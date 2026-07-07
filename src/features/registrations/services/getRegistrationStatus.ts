import {
  getRegistrationPeriodStatus,
  type RegistrationPeriodStatus,
} from '@/features/registrations/domain';
import { getServerEnv } from '@/lib/env';

export type SerializedRegistrationPeriodStatus = Omit<
  RegistrationPeriodStatus,
  'closesAt' | 'opensAt' | 'serverTime'
> & {
  closesAt?: string;
  opensAt?: string;
  serverTime: string;
};

export function getSerializedRegistrationStatus(): SerializedRegistrationPeriodStatus {
  const { registrationsOpenAt, registrationsCloseAt } = getServerEnv();
  const status = getRegistrationPeriodStatus(new Date(), registrationsOpenAt, registrationsCloseAt);

  return {
    ...status,
    closesAt: status.closesAt?.toISOString(),
    opensAt: status.opensAt?.toISOString(),
    serverTime: status.serverTime.toISOString(),
  };
}
