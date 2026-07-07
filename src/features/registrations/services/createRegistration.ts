import { ZodError } from 'zod';
import {
  areRegistrationsOpen,
  normalizeRegistrationInput,
  registrationInputSchema,
  type Registration,
} from '@/features/registrations/domain';
import { getServerEnv } from '@/lib/env';
import { RegistrationModel, type RegistrationDocument } from '@/models/Registration';

type CreateRegistrationResult = {
  registration: Registration;
};

type MongoDuplicateKeyError = Error & {
  code?: number;
};

export class RegistrationValidationError extends Error {
  constructor(public readonly details: Record<string, string[]>) {
    super('Invalid registration data');
    this.name = 'RegistrationValidationError';
  }
}

export class RegistrationClosedError extends Error {
  constructor() {
    super('Registrations are closed');
    this.name = 'RegistrationClosedError';
  }
}

export class DuplicateRegistrationError extends Error {
  constructor() {
    super('Registration already exists');
    this.name = 'DuplicateRegistrationError';
  }
}

export async function createRegistration(payload: unknown): Promise<CreateRegistrationResult> {
  const { registrationsOpenAt, registrationsCloseAt } = getServerEnv();

  if (!areRegistrationsOpen(new Date(), registrationsOpenAt, registrationsCloseAt)) {
    throw new RegistrationClosedError();
  }

  const input = parseRegistrationPayload(payload);
  const normalizedInput = normalizeRegistrationInput(input);

  try {
    const registration = await RegistrationModel.create({
      ...normalizedInput,
      status: 'pending',
    });

    return {
      registration: serializeRegistration(registration),
    };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateRegistrationError();
    }

    throw error;
  }
}

function parseRegistrationPayload(payload: unknown) {
  try {
    return registrationInputSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new RegistrationValidationError(removeEmptyFieldErrors(error.flatten().fieldErrors));
    }

    throw error;
  }
}

function serializeRegistration(registration: RegistrationDocument & { _id: unknown }): Registration {
  return {
    id: String(registration._id),
    fullName: registration.fullName,
    callNumber: registration.callNumber,
    className: registration.className,
    schoolYear: registration.schoolYear,
    nickname: registration.nickname,
    preferredGame: registration.preferredGame,
    status: registration.status,
    isSeedData: registration.isSeedData,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
  };
}

function isDuplicateKeyError(error: unknown): error is MongoDuplicateKeyError {
  return error instanceof Error && (error as MongoDuplicateKeyError).code === 11000;
}

function removeEmptyFieldErrors(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(
    Object.entries(fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length))
  );
}
