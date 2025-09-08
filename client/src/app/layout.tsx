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
      <body style={{ margin: 0, padding: 0, height: '100vh' }}>
        <QueryClientProvider client={queryClient}>
          <ThemeRegistry>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh'
              }}
            >
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeRegistry>
        </QueryClientProvider>
      </body>
    </html>
  );
}
