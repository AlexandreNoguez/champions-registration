import { z } from 'zod';
import { registrationStatusValues } from './registration.types';

const requiredText = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} é obrigatório`);

export const registrationInputSchema = z.object({
  fullName: requiredText('Nome completo'),
  callNumber: requiredText('Número da chamada'),
  className: requiredText('Turma'),
  schoolYear: requiredText('Ano escolar'),
  nickname: requiredText('Apelido ou nome de gamer'),
  preferredGame: requiredText('Jogo preferido'),
  platform: requiredText('Plataforma'),
  responsibleContact: requiredText('Contato do responsável'),
  consent: z.boolean().refine((value) => value, {
    message: 'O consentimento é obrigatório',
  }),
});

export const registrationStatusSchema = z.enum(registrationStatusValues);

export const registrationSchema = registrationInputSchema.extend({
  id: z.string(),
  status: registrationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type RegistrationInput = z.infer<typeof registrationInputSchema>;
