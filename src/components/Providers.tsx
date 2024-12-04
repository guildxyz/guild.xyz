"use client";

import { wagmiConfig } from "@/config/wagmi";
import { getQueryClient } from "@/lib/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import type { FunctionComponent, PropsWithChildren } from "react";
import { WagmiProvider } from "wagmi";
import { TooltipProvider } from "./ui/Tooltip";

const queryClient = getQueryClient();

export const Providers: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <JotaiProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </WagmiProvider>
        </TooltipProvider>
      </ThemeProvider>
    </JotaiProvider>
  );
};
