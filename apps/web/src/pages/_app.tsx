'use client';

import App, { type AppContext, type AppInitialProps } from "next/app";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import "@/styles/globals.css";
import { wagmiConfig } from "@/utils/wagmi";

export default function NexoraApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

NexoraApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
  return App.getInitialProps(appContext);
};
