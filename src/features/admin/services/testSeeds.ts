import { isTeamTournamentGame, tournamentGameValues } from '@/features/registrations/domain';
import { RegistrationModel } from '@/models/Registration';

const seedClassName = 'SEED';
const seedSchoolYear = 'Teste';
const seedCount = 50;
const teamPartnerOffset = 25;
const seedNames = [
  'Maria',
  'Pedro',
  'Ana',
  'Joao',
  'Julia',
  'Lucas',
  'Beatriz',
  'Gabriel',
  'Laura',
  'Matheus',
  'Sofia',
  'Rafael',
  'Isabela',
  'Gustavo',
  'Manuela',
  'Felipe',
  'Helena',
  'Arthur',
  'Clara',
  'Davi',
  'Valentina',
  'Miguel',
  'Livia',
  'Henrique',
  'Alice',
  'Bernardo',
  'Mariana',
  'Enzo',
  'Luiza',
  'Vitor',
  'Camila',
  'Caio',
  'Yasmin',
  'Thiago',
  'Ester',
  'Leonardo',
  'Larissa',
  'Bruno',
  'Nicole',
  'Samuel',
  'Amanda',
  'Diego',
  'Carolina',
  'Eduardo',
  'Leticia',
  'Vinicius',
  'Bianca',
  'Murilo',
  'Fernanda',
  'Daniel',
];

export async function createTestSeeds() {
  await RegistrationModel.deleteMany({ isSeedData: true }).exec();

  const registrations = Array.from({ length: seedCount }, (_, index) => {
    const preferredGame = tournamentGameValues[index % tournamentGameValues.length];
    const seedNumber = index + 1;
    const seedName = seedNames[index];
    const partnerName = seedNames[(index + teamPartnerOffset) % seedNames.length];
    const partnerSeedNumber = seedNumber + seedCount;

    const registration = {
      fullName: `${seedName} Seed`,
      callNumber: `S${seedNumber.toString().padStart(2, '0')}`,
      className: seedClassName,
      schoolYear: seedSchoolYear,
      nickname: `${seedName.toLowerCase()}-seed`,
      preferredGame,
      status: 'pending',
      isSeedData: true,
    };

    if (!isTeamTournamentGame(preferredGame)) {
      return registration;
    }

    return {
      ...registration,
      partnerFullName: `${partnerName} Dupla Seed`,
      partnerCallNumber: `S${partnerSeedNumber.toString().padStart(2, '0')}`,
      partnerClassName: seedClassName,
      partnerSchoolYear: seedSchoolYear,
      partnerNickname: `${partnerName.toLowerCase()}-dupla`,
    };
  });

  await RegistrationModel.insertMany(registrations, { ordered: true });

  return {
    created: registrations.length,
    message: '50 seeds de teste foram criadas, com Futmesa e Flaflu em duplas.',
  };
}

export async function deleteTestSeeds() {
  const result = await RegistrationModel.deleteMany({ isSeedData: true }).exec();

  return {
    deleted: result.deletedCount || 0,
    message: 'Seeds de teste removidas.',
  };
}
