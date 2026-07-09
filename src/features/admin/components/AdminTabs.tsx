import { Paper, Tab, Tabs } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { tournamentGameValues, type TournamentGame } from '@/features/registrations/domain';

export type AdminTabValue = 'registrations' | TournamentGame;

type AdminTabsProps = {
  activeTab: AdminTabValue;
  onChange: (event: SyntheticEvent, value: AdminTabValue) => void;
};

// Renderiza as abas do painel entre lista de inscritos e chaveamentos.
export function AdminTabs({ activeTab, onChange }: AdminTabsProps) {
  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Tabs
        allowScrollButtonsMobile
        onChange={onChange}
        scrollButtons="auto"
        sx={{
          minHeight: 56,
          px: { xs: 1, sm: 2 },
          '& .MuiTab-root': {
            minHeight: 56,
            textTransform: 'none',
          },
        }}
        value={activeTab}
        variant="scrollable"
      >
        <Tab label="Inscritos" value="registrations" />
        {tournamentGameValues.map((game) => (
          <Tab key={game} label={game} value={game} />
        ))}
      </Tabs>
    </Paper>
  );
}
