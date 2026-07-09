import { z } from 'zod';
import {
  isTeamTournamentGame,
  registrationStatusValues,
  tournamentGameValues,
} from './registration.types';

const requiredText = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} é obrigatório`);

const optionalText = z.string().trim().optional();

const teamGamePartnerFields = [
  ['partnerFullName', 'Nome completo do parceiro'],
  ['partnerClassName', 'Turma do parceiro'],
  ['partnerSchoolYear', 'Ano escolar do parceiro'],
  ['partnerNickname', 'Apelido do parceiro'],
] as const;

const registrationFieldsSchema = z.object({
  fullName: requiredText('Nome completo'),
  callNumber: optionalText,
  className: requiredText('Turma'),
  schoolYear: requiredText('Ano escolar'),
  nickname: requiredText('Apelido ou nome de gamer'),
  preferredGame: z.enum(tournamentGameValues, {
    errorMap: () => ({ message: 'Selecione um jogo válido' }),
  }),
  partnerFullName: optionalText,
  partnerCallNumber: optionalText,
  partnerClassName: optionalText,
  partnerSchoolYear: optionalText,
  partnerNickname: optionalText,
});

export const registrationInputSchema = registrationFieldsSchema.superRefine((input, context) => {
  if (!isTeamTournamentGame(input.preferredGame)) {
    return;
  }

  teamGamePartnerFields.forEach(([fieldName, label]) => {
    if (!input[fieldName]?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${label} é obrigatório para ${input.preferredGame}`,
        path: [fieldName],
      });
    }
  });

  const primaryIdentity = buildStudentIdentity(
    input.fullName,
    input.className,
    input.callNumber
  );
  const partnerIdentity =
    input.partnerFullName && input.partnerClassName
      ? buildStudentIdentity(
          input.partnerFullName,
          input.partnerClassName,
          input.partnerCallNumber
        )
      : '';

  if (partnerIdentity && partnerIdentity === primaryIdentity) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe um parceiro diferente do aluno principal',
      path: ['partnerCallNumber'],
    });
  }
});

function buildStudentIdentity(fullName: string, className: string, callNumber?: string) {
  if (callNumber?.trim()) {
    return `${className.trim().toLowerCase()}-${callNumber.trim()}`;
  }

  return `${className.trim().toLowerCase()}-${fullName.trim().toLowerCase()}`;
}

export const registrationStatusSchema = z.enum(registrationStatusValues);

export const registrationSchema = registrationFieldsSchema.extend({
  id: z.string(),
  status: registrationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;
