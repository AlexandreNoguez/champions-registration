import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { AdminRegistration } from '@/features/admin/services/listAdminRegistrations';
import { statusColors, statusLabels } from './registrationStatusDisplay';

type RegistrationsTableProps = {
  registrations: AdminRegistration[];
};

// Exibe a tabela detalhada de inscrições administrativas.
export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aluno</TableCell>
              <TableCell>Turma</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Chamada</TableCell>
              <TableCell>Gamer</TableCell>
              <TableCell>Dupla</TableCell>
              <TableCell>Jogo</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Inscrição</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.length ? (
              registrations.map((registration) => (
                <TableRow key={registration.id} hover>
                  <TableCell>{registration.fullName}</TableCell>
                  <TableCell>{registration.className}</TableCell>
                  <TableCell>{registration.schoolYear}</TableCell>
                  <TableCell>{registration.callNumber || '-'}</TableCell>
                  <TableCell>{registration.nickname}</TableCell>
                  <TableCell>
                    {registration.partnerFullName ? (
                      <Box>
                        <Typography variant="body2">{registration.partnerFullName}</Typography>
                        <Typography color="text.secondary" variant="caption">
                          {formatPartnerDetails(registration)}
                        </Typography>
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{registration.preferredGame}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        color={statusColors[registration.status]}
                        label={statusLabels[registration.status]}
                        size="small"
                      />
                      {registration.isSeedData ? (
                        <Chip color="info" label="Seed" size="small" />
                      ) : null}
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDateTime(registration.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <Typography color="text.secondary" sx={{ py: 2 }} textAlign="center">
                    Nenhuma inscrição encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function formatPartnerDetails(registration: AdminRegistration) {
  return [
    registration.partnerNickname,
    registration.partnerClassName,
    registration.partnerCallNumber ? `chamada ${registration.partnerCallNumber}` : '',
  ]
    .filter(Boolean)
    .join(' - ');
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
