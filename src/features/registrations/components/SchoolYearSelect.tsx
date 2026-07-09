import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import type { RegistrationInput } from '@/features/registrations/domain';
import { schoolYearOptions } from './registrationFormFields';

type SchoolYearSelectProps = {
  control: Control<RegistrationInput>;
  errors: FieldErrors<RegistrationInput>;
  isDisabled: boolean;
  label: string;
  name: 'schoolYear' | 'partnerSchoolYear';
};

// Renderiza a seleção de ano escolar para aluno principal ou parceiro.
export function SchoolYearSelect({
  control,
  errors,
  isDisabled,
  label,
  name,
}: SchoolYearSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const errorMessage = errors[name]?.message;
        const labelId = `${name}-label`;

        return (
          <FormControl fullWidth error={Boolean(errorMessage)}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
              {...field}
              disabled={isDisabled}
              label={label}
              labelId={labelId}
            >
              {schoolYearOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errorMessage || ' '}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
}
