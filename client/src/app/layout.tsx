import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Footer from '../components/footer';
import ClientWrapper from '../components/clientWrapper';
import { Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'Travel Planner - Discover Your Next Adventure',
  description: 'Plan your perfect trip with real-time weather data, stunning photos, and personalized recommendations.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: '100vh' }}>
        <ClientWrapper>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
          >
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </ClientWrapper>
      </body>
    </html>
  );
}
