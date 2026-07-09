import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppThemeProvider } from '@/components/AppThemeProvider';

export const metadata: Metadata = {
  title: 'Champions Form',
  description: 'Sistema de inscrições para torneio de videogames',
};

// Define a estrutura raiz da aplicação e aplica o tema global.
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
