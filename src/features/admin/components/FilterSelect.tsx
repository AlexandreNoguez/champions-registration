import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { AdminRegistrationFilters } from '@/features/admin/services/listAdminRegistrations';

type FilterSelectProps = {
  getLabel?: (value: string) => string;
  label: string;
  name: keyof AdminRegistrationFilters;
  onChange: (event: SelectChangeEvent) => void;
  options: string[];
  value: string;
};

// Renderiza um seletor de filtro reutilizável no painel administrativo.
export function FilterSelect({ getLabel, label, name, onChange, options, value }: FilterSelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id={`${name}-filter-label`}>{label}</InputLabel>
      <Select
        label={label}
        labelId={`${name}-filter-label`}
        onChange={onChange}
        value={value}
      >
        <MenuItem value="">Todos</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {getLabel ? getLabel(option) : option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
