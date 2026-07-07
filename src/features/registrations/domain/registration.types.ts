export const registrationStatusValues = ['pending', 'approved', 'rejected'] as const;

export type RegistrationStatus = (typeof registrationStatusValues)[number];

export type Registration = {
  id: string;
  fullName: string;
  callNumber: string;
  className: string;
  schoolYear: string;
  nickname: string;
  preferredGame: string;
  platform: string;
  responsibleContact: string;
  consent: boolean;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
};
