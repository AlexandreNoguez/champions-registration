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
  const primaryDetails = formatParticipantDetails(
    participant.nickname,
    participant.className,
    participant.callNumber
  );

  if (!participant.partner) {
    return primaryDetails;
  }

  return `${primaryDetails} | ${formatParticipantDetails(
    participant.partner.nickname,
    participant.partner.className,
    participant.partner.callNumber
  )}`;
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

function formatParticipantDetails(nickname: string, className: string, callNumber?: string) {
  return [
    nickname,
    className,
    callNumber ? `chamada ${callNumber}` : '',
  ]
    .filter(Boolean)
    .join(' - ');
}
