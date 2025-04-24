'use client';

import { useAtomValue } from 'jotai';
import { queryClientAtom } from '../libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import ThemeRegistry from '../components/themeRegistry';
import Header from '../components/header';
import Footer from '../components/footer';
import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const queryClient = useAtomValue(queryClientAtom);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeRegistry>
            <Header />
            <Box display="flex" flexDirection="column">
              <Box component="main" flexGrow={1}>
                {children}
              </Box>
            </Box>
            <Footer />
          </ThemeRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
