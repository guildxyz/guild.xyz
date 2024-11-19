"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "app/config/wagmi";
import { ThemeProvider } from "next-themes";
import type { FunctionComponent, PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

export const Providers: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};
