export const tournamentGameValues = [
  'FC26',
  'STREET FIGHTER 6',
  'Tartaruga ninja',
  'Futmesa',
  'Flaflu',
] as const;

export const registrationStatusValues = ['pending', 'approved', 'rejected'] as const;

export type TournamentGame = (typeof tournamentGameValues)[number];

export type RegistrationStatus = (typeof registrationStatusValues)[number];

export type Registration = {
  id: string;
  fullName: string;
  callNumber: string;
  className: string;
  schoolYear: string;
  nickname: string;
  preferredGame: TournamentGame;
  partnerFullName?: string;
  partnerCallNumber?: string;
  partnerClassName?: string;
  partnerSchoolYear?: string;
  partnerNickname?: string;
  status: RegistrationStatus;
  isSeedData?: boolean;
  createdAt: Date;
  updatedAt: Date;
};
