import { tournamentGameValues } from '@/features/registrations/domain';
import { RegistrationModel } from '@/models/Registration';

const seedClassName = 'SEED';
const seedSchoolYear = 'Teste';
const seedCount = 50;

export async function createTestSeeds() {
  await RegistrationModel.deleteMany({ isSeedData: true }).exec();

  const registrations = Array.from({ length: seedCount }, (_, index) => {
    const preferredGame = tournamentGameValues[index % tournamentGameValues.length];
    const seedNumber = index + 1;

    return {
      fullName: `Seed Teste ${seedNumber.toString().padStart(2, '0')}`,
      callNumber: `S${seedNumber.toString().padStart(2, '0')}`,
      className: seedClassName,
      schoolYear: seedSchoolYear,
      nickname: `seed-${seedNumber.toString().padStart(2, '0')}`,
      preferredGame,
      status: 'pending',
      isSeedData: true,
    };
  });

  await RegistrationModel.insertMany(registrations, { ordered: true });

  return {
    created: registrations.length,
    message: '50 seeds de teste foram criadas.',
  };
}

export async function deleteTestSeeds() {
  const result = await RegistrationModel.deleteMany({ isSeedData: true }).exec();

  return {
    deleted: result.deletedCount || 0,
    message: 'Seeds de teste removidas.',
  };
}
