import type { RegistrationInput } from '@/features/registrations/domain';

export const schoolYearOptions = [
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
  '1º ano do ensino médio',
  '2º ano do ensino médio',
  '3º ano do ensino médio',
];

export type RegistrationTextFieldName = Exclude<
  keyof RegistrationInput,
  'schoolYear' | 'preferredGame' | 'partnerSchoolYear'
>;

export type RegistrationTextField = {
  name: RegistrationTextFieldName;
  label: string;
  helperText?: string;
  autoComplete?: string;
};

export const identityFields: RegistrationTextField[] = [
  {
    name: 'fullName',
    label: 'Nome completo',
    autoComplete: 'name',
  },
  {
    name: 'callNumber',
    label: 'Número da chamada (opcional)',
    helperText: 'Preencha se souber o número da lista oficial da turma.',
  },
  {
    name: 'className',
    label: 'Turma',
    helperText: 'Exemplo: 7A',
  },
];

export const gameFields: RegistrationTextField[] = [
  {
    name: 'nickname',
    label: 'Apelido ou nome de gamer',
  },
];

export const partnerFields: RegistrationTextField[] = [
  {
    name: 'partnerFullName',
    label: 'Nome completo do parceiro',
    autoComplete: 'name',
  },
  {
    name: 'partnerCallNumber',
    label: 'Número da chamada do parceiro (opcional)',
  },
  {
    name: 'partnerClassName',
    label: 'Turma do parceiro',
    helperText: 'Exemplo: 7A',
  },
  {
    name: 'partnerNickname',
    label: 'Apelido do parceiro',
  },
];
