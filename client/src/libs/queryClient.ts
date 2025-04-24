import { QueryClient } from '@tanstack/react-query';
import { atom } from 'jotai';

export const queryClient = new QueryClient();

export const queryClientAtom = atom(queryClient);
