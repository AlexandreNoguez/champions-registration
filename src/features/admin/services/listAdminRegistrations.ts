import { z } from 'zod';
import {
  registrationStatusSchema,
  registrationStatusValues,
  type RegistrationStatus,
  tournamentGameValues,
  type TournamentGame,
} from '@/features/registrations/domain';
import { RegistrationModel } from '@/models/Registration';

export type AdminRegistration = {
  id: string;
  fullName: string;
  callNumber: string;
  className: string;
  schoolYear: string;
  nickname: string;
  preferredGame: TournamentGame;
  status: RegistrationStatus;
  isSeedData: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminRegistrationFilters = {
  className?: string;
  preferredGame?: TournamentGame;
  schoolYear?: string;
  status?: RegistrationStatus;
};

export type AdminRegistrationListResponse = {
  filters: AdminRegistrationFilters;
  filterOptions: {
    classNames: string[];
    games: TournamentGame[];
    schoolYears: string[];
    statuses: RegistrationStatus[];
  };
  registrations: AdminRegistration[];
  totals: {
    byStatus: Record<RegistrationStatus, number>;
    filtered: number;
    total: number;
  };
};

const adminRegistrationFilterSchema = z.object({
  className: z.string().trim().optional(),
  preferredGame: z.enum(tournamentGameValues).optional(),
  schoolYear: z.string().trim().optional(),
  status: registrationStatusSchema.optional(),
});

export function parseAdminRegistrationFilters(searchParams: URLSearchParams): AdminRegistrationFilters {
  const parsedFilters = adminRegistrationFilterSchema.parse({
    className: normalizeOptionalSearchParam(searchParams.get('className'))?.toUpperCase(),
    preferredGame: normalizeOptionalSearchParam(searchParams.get('preferredGame')),
    schoolYear: normalizeOptionalSearchParam(searchParams.get('schoolYear')),
    status: normalizeOptionalSearchParam(searchParams.get('status')),
  });

  return removeEmptyFilters(parsedFilters);
}

export async function listAdminRegistrations(
  filters: AdminRegistrationFilters
): Promise<AdminRegistrationListResponse> {
  const mongoFilter = buildMongoFilter(filters);

  const [
    registrations,
    filtered,
    total,
    pending,
    approved,
    rejected,
    classNames,
    schoolYears,
  ] = await Promise.all([
    RegistrationModel.find(mongoFilter).sort({ createdAt: -1 }).limit(500).exec(),
    RegistrationModel.countDocuments(mongoFilter).exec(),
    RegistrationModel.countDocuments().exec(),
    RegistrationModel.countDocuments({ status: 'pending' }).exec(),
    RegistrationModel.countDocuments({ status: 'approved' }).exec(),
    RegistrationModel.countDocuments({ status: 'rejected' }).exec(),
    RegistrationModel.distinct('className').exec(),
    RegistrationModel.distinct('schoolYear').exec(),
  ]);

  return {
    filters,
    filterOptions: {
      classNames: sortTextValues(classNames),
      games: [...tournamentGameValues],
      schoolYears: sortTextValues(schoolYears),
      statuses: [...registrationStatusValues],
    },
    registrations: registrations.map((registration) => ({
      id: String(registration._id),
      fullName: registration.fullName,
      callNumber: registration.callNumber,
      className: registration.className,
      schoolYear: registration.schoolYear,
      nickname: registration.nickname,
      preferredGame: registration.preferredGame,
      status: registration.status,
      isSeedData: Boolean(registration.isSeedData),
      createdAt: registration.createdAt.toISOString(),
      updatedAt: registration.updatedAt.toISOString(),
    })),
    totals: {
      byStatus: {
        pending,
        approved,
        rejected,
      },
      filtered,
      total,
    },
  };
}

function buildMongoFilter(filters: AdminRegistrationFilters) {
  const mongoFilter: Record<string, string> = {};

  if (filters.className) {
    mongoFilter.className = filters.className;
  }

  if (filters.preferredGame) {
    mongoFilter.preferredGame = filters.preferredGame;
  }

  if (filters.schoolYear) {
    mongoFilter.schoolYear = filters.schoolYear;
  }

  if (filters.status) {
    mongoFilter.status = filters.status;
  }

  return mongoFilter;
}

function normalizeOptionalSearchParam(value: string | null) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function removeEmptyFilters(filters: AdminRegistrationFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value))
  ) as AdminRegistrationFilters;
}

function sortTextValues(values: unknown[]) {
  return values
    .filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
    .sort((first, second) => first.localeCompare(second, 'pt-BR', { numeric: true }));
}
