import { Box } from '@mui/material';
import type { ReactNode } from 'react';

// Organiza os campos do formulário em uma grade responsiva.
export function ResponsiveFieldGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
        },
      }}
    >
      {children}
    </Box>
  );
}
