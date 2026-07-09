import { useMemo } from 'react';
import { useResponsiveLayout } from '@/shared/hooks/useResponsiveLayout';
import type { GameDraw } from '@/features/draws/domain';
import { buildBracketSides } from '@/features/admin/components/bracketLayout';

export function useGameBracketLayout(gameDraw: GameDraw) {
  const layout = useResponsiveLayout();
  const finalMatch = gameDraw.rounds.at(-1)?.[0] || null;
  const bracketSides = useMemo(
    () => (finalMatch ? buildBracketSides(gameDraw, finalMatch) : { left: [], right: [] }),
    [finalMatch, gameDraw]
  );
  const sideColumnCount = bracketSides.left.length + bracketSides.right.length;
  const champion = finalMatch?.winner;
  const leftGridColumns = bracketSides.left
    .map(() => `minmax(${layout.bracket.columnMinWidth}px, 1fr)`)
    .join(' ');
  const rightGridColumns = bracketSides.right
    .map(() => `minmax(${layout.bracket.columnMinWidth}px, 1fr)`)
    .join(' ');

  return {
    bracketSides,
    champion,
    finalMatch,
    layout,
    leftGridColumns,
    rightGridColumns,
    sideColumnCount,
  };
}
