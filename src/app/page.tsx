import { Box, Container, Stack, Typography } from '@mui/material';
import { RegistrationForm } from '@/features/registrations/components/RegistrationForm';

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'grey.100',
        minHeight: '100vh',
        py: { xs: 3, sm: 6 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="primary">
              Torneio escolar
            </Typography>
            <Typography variant="h3" component="p">
              Inscreva-se para competir
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              Preencha os dados abaixo para registrar a participação no Champions Form.
            </Typography>
          </Box>

          <RegistrationForm />
        </Stack>
      </Container>
    </Box>
  );
}
