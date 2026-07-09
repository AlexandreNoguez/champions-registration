import { TextField } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { RegistrationInput } from '@/features/registrations/domain';
import type { RegistrationTextField } from './registrationFormFields';

type RegistrationTextInputProps = {
  errors: FieldErrors<RegistrationInput>;
  field: RegistrationTextField;
  isDisabled: boolean;
  register: UseFormRegister<RegistrationInput>;
};

// Renderiza um campo de texto integrado ao React Hook Form.
export function RegistrationTextInput({
  errors,
  field,
  isDisabled,
  register,
}: RegistrationTextInputProps) {
  const errorMessage = errors[field.name]?.message;

  return (
    <TextField
      {...register(field.name)}
      autoComplete={field.autoComplete}
      disabled={isDisabled}
      error={Boolean(errorMessage)}
      fullWidth
      helperText={errorMessage || field.helperText || ' '}
      label={field.label}
      variant="outlined"
    />
  );
}
