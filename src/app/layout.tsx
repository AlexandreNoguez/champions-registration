import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppThemeProvider } from '@/components/AppThemeProvider';

export const metadata: Metadata = {
  title: 'Champions Form',
  description: 'Sistema de inscrições para torneio de videogames',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}
