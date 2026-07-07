import type { RegistrationInput } from './registration.schema';

const registrationPeriodDays = 14;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type RegistrationPeriodStatus = {
  closesAt?: Date;
  isOpen: boolean;
  message: string;
  opensAt?: Date;
  serverTime: Date;
  status: 'open' | 'not_started' | 'closed';
};

export function buildRegistrationIdentity(input: Pick<RegistrationInput, 'callNumber' | 'className'>) {
  return `${input.className.trim().toLowerCase()}-${input.callNumber.trim()}`;
}

export function areRegistrationsOpen(now: Date, opensAt?: Date, closesAt?: Date) {
  return getRegistrationPeriodStatus(now, opensAt, closesAt).isOpen;
}

export function getRegistrationPeriodStatus(
  now: Date,
  opensAt?: Date,
  closesAt?: Date
): RegistrationPeriodStatus {
  const resolvedClosesAt = resolveRegistrationsCloseAt(opensAt, closesAt);

  if (opensAt && now < opensAt) {
    return {
      closesAt: resolvedClosesAt,
      isOpen: false,
      message: 'As inscrições ainda não começaram.',
      opensAt,
      serverTime: now,
      status: 'not_started',
    };
  }

  if (resolvedClosesAt && now > resolvedClosesAt) {
    return {
      closesAt: resolvedClosesAt,
      isOpen: false,
      message: 'As inscrições estão encerradas.',
      opensAt,
      serverTime: now,
      status: 'closed',
    };
  }

  return {
    closesAt: resolvedClosesAt,
    isOpen: true,
    message: 'As inscrições estão abertas.',
    opensAt,
    serverTime: now,
    status: 'open',
  };
}

export function resolveRegistrationsCloseAt(opensAt?: Date, closesAt?: Date) {
  if (closesAt) {
    return closesAt;
  }

  if (!opensAt) {
    return undefined;
  }

  return new Date(opensAt.getTime() + registrationPeriodDays * millisecondsPerDay);
}

export function normalizeRegistrationInput(input: RegistrationInput): RegistrationInput {
  return {
    fullName: input.fullName.trim(),
    callNumber: input.callNumber.trim(),
    className: input.className.trim().toUpperCase(),
    schoolYear: input.schoolYear.trim(),
    nickname: input.nickname.trim(),
    preferredGame: input.preferredGame,
  };
}
