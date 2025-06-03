import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1
      }
    }
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
}
