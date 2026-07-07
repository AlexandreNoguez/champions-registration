'use client';

import { useMediaQuery, useTheme } from '@mui/material';

export type AppViewport = 'mobile' | 'tablet' | 'desktop' | 'wide';

export function useResponsiveLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), { noSsr: true });
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'), { noSsr: true });
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const isWide = useMediaQuery(theme.breakpoints.up('xl'), { noSsr: true });
  const viewport: AppViewport = isMobile
    ? 'mobile'
    : isTablet
      ? 'tablet'
      : isWide
        ? 'wide'
        : 'desktop';

  return {
    admin: {
      contentMaxWidth: isWide ? 1760 : isDesktop ? 1520 : '100%',
      horizontalPadding: isMobile ? 2 : isTablet ? 3 : isWide ? 5 : 4,
    },
    bracket: {
      columnMinWidth: isWide ? 230 : isDesktop ? 210 : 190,
      finalMinWidth: isWide ? 330 : isDesktop ? 290 : 250,
      gap: isWide ? 3 : isDesktop ? 2 : 1.5,
      getRoundGap: (roundNumber: number) => {
        if (!isDesktop) {
          return 1;
        }

        return Math.min(isWide ? 8 : 6.5, 1 + roundNumber * (isWide ? 1.8 : 1.45));
      },
      minWidth: (sideColumnCount: number) => {
        if (!isDesktop) {
          return '100%';
        }

        const columnWidth = isWide ? 250 : 225;
        const finalWidth = isWide ? 330 : 290;

        return Math.max(isWide ? 1180 : 960, sideColumnCount * columnWidth + finalWidth);
      },
    },
    isDesktop,
    isMobile,
    isTablet,
    isWide,
    viewport,
  };
}
