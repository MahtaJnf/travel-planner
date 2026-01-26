import type { ReactNode } from 'react';
import Footer from '../components/footer';
import ClientWrapper from '../components/clientWrapper';
import { Box } from '@mui/material';

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
