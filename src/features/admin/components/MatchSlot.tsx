import { Box, ButtonBase, Chip, Stack, Tooltip, Typography } from '@mui/material';
import type { DrawSlot } from '@/features/draws/domain';
import {
  getParticipantDetails,
  getParticipantDisplayName,
  getParticipantTooltipTitle,
} from './drawParticipantDisplay';

type MatchSlotProps = {
  isWinner: boolean;
  matchId: string;
  onAdvanceWinner: () => void;
  slot: DrawSlot;
};

// Renderiza um competidor clicável dentro de uma partida do bracket.
export function MatchSlot({ isWinner, matchId, onAdvanceWinner, slot }: MatchSlotProps) {
  const isPendingSlot = slot.label === 'A definir';
  const isBye = slot.label === 'BYE';
  const canAdvance = Boolean(slot.participant);
  const primaryText = slot.participant ? getParticipantDisplayName(slot.participant) : slot.label;
  const secondaryText = slot.participant ? getParticipantDetails(slot.participant) : '';
  const slotButton = (
    <ButtonBase
      aria-label={canAdvance ? `Avançar ${slot.label} no jogo ${matchId}` : slot.label}
      disabled={!canAdvance}
      onClick={onAdvanceWinner}
      sx={{
        alignItems: 'stretch',
        bgcolor: isWinner ? '#5b0a78' : 'rgba(50, 18, 77, 0.04)',
        border: '1px solid',
        borderColor: isWinner ? '#ffd966' : 'rgba(50, 18, 77, 0.1)',
        borderRadius: 1.5,
        color: isWinner ? 'common.white' : 'text.primary',
        display: 'flex',
        justifyContent: 'flex-start',
        minHeight: 54,
        px: 1.25,
        py: 0.85,
        textAlign: 'left',
        transition: 'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
        width: '100%',
        '&:hover': {
          bgcolor: isWinner ? '#3a075f' : 'rgba(91, 10, 120, 0.1)',
          borderColor: isWinner ? '#ffd966' : 'rgba(91, 10, 120, 0.3)',
        },
        '&.Mui-disabled': {
          color: isPendingSlot || isBye ? 'text.secondary' : 'text.primary',
          opacity: 1,
        },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            noWrap
            variant="body2"
            sx={{
              fontStyle: isPendingSlot ? 'italic' : 'normal',
              fontWeight: isWinner ? 700 : 500,
              lineHeight: 1.2,
            }}
          >
            {primaryText}
          </Typography>
          {slot.participant ? (
            <Typography
              noWrap
              variant="caption"
              sx={{ color: isWinner ? 'rgba(255, 255, 255, 0.78)' : 'text.secondary' }}
            >
              {secondaryText}
            </Typography>
          ) : null}
        </Box>
        {isWinner ? (
          <Chip
            label="Avançou"
            size="small"
            sx={{ bgcolor: '#ffd966', color: '#32124d', fontWeight: 700 }}
          />
        ) : null}
      </Stack>
    </ButtonBase>
  );

  if (!slot.participant) {
    return slotButton;
  }

  return (
    <Tooltip title={getParticipantTooltipTitle(slot.participant)}>
      {slotButton}
    </Tooltip>
  );
}
