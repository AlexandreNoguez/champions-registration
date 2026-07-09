import { Box, Typography } from '@mui/material';
import type { DrawSlot } from '@/features/draws/domain';

type DrawParticipant = NonNullable<DrawSlot['participant']>;

export function getParticipantDisplayName(participant: DrawParticipant) {
  if (participant.partner) {
    return `${participant.fullName} + ${participant.partner.fullName}`;
  }

  return participant.fullName;
}

export function getParticipantDetails(participant: DrawParticipant) {
  const primaryDetails = `${participant.nickname} - ${participant.className} - chamada ${participant.callNumber}`;

  if (!participant.partner) {
    return primaryDetails;
  }

  return `${primaryDetails} | ${participant.partner.nickname} - ${participant.partner.className} - chamada ${participant.partner.callNumber}`;
}

export function getParticipantTooltipTitle(participant: DrawParticipant) {
  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {getParticipantDisplayName(participant)}
      </Typography>
      <Typography variant="caption">{getParticipantDetails(participant)}</Typography>
    </Box>
  );
}
