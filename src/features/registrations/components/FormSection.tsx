import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type FormSectionProps = {
  children: ReactNode;
  description: string;
  title: string;
};

// Agrupa campos relacionados do formulário com título e descrição.
export function FormSection({ children, description, title }: FormSectionProps) {
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {children}
    </Stack>
  );
}
