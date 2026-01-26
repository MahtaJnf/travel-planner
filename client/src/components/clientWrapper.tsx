'use client';

import { useAtomValue } from 'jotai';
import { queryClientAtom } from '../libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import ThemeRegistry from './themeRegistry';
import type { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const queryClient = useAtomValue(queryClientAtom);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </QueryClientProvider>
  );
}
