import type { TournamentGame } from '@/features/registrations/domain';

export type DrawParticipant = {
  registrationId: string;
  fullName: string;
  callNumber?: string;
  className: string;
  schoolYear: string;
  nickname: string;
  partner?: {
    fullName: string;
    callNumber?: string;
    className: string;
    schoolYear: string;
    nickname: string;
  };
};

export type DrawSlot = {
  label: string;
  participant?: DrawParticipant;
  sourceMatchId?: string;
};

export type DrawMatch = {
  id: string;
  round: number;
  position: number;
  slotA: DrawSlot;
  slotB: DrawSlot;
  hasBye: boolean;
  winner?: DrawParticipant;
  winnerSlot?: 'slotA' | 'slotB';
};

export type GameDraw = {
  game: TournamentGame;
  participantCount: number;
  rounds: DrawMatch[][];
};
