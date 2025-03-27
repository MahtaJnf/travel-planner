// app/layout.tsx
import ThemeRegistry from '../components/themeRegistry';
import Header from '../components/header';
import Footer from '../components/footer';
import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <Header />
          <Box display="flex" flexDirection="column">
            <Box component="main" flexGrow={1}>
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
        <Footer />
      </body>
    </html>
  );
}
