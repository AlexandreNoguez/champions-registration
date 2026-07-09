import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import {
  tournamentGameValues,
  type RegistrationInput,
} from '@/features/registrations/domain';

type PreferredGameSelectProps = {
  control: Control<RegistrationInput>;
  errors: FieldErrors<RegistrationInput>;
  isDisabled: boolean;
};

// Renderiza a seleção do jogo escolhido para a inscrição.
export function PreferredGameSelect({ control, errors, isDisabled }: PreferredGameSelectProps) {
  return (
    <Controller
      control={control}
      name="preferredGame"
      render={({ field }) => {
        const errorMessage = errors.preferredGame?.message;

        return (
          <FormControl fullWidth error={Boolean(errorMessage)}>
            <InputLabel id="preferred-game-label">Jogo</InputLabel>
            <Select
              {...field}
              disabled={isDisabled}
              label="Jogo"
              labelId="preferred-game-label"
            >
              {tournamentGameValues.map((option) => (
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
