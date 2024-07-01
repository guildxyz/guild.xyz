"use client"

import { FuelProvider } from "@fuels/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import IntercomProvider from "components/_app/IntercomProvider"
import { PostHogProvider } from "components/_app/PostHogProvider"
import { Web3ConnectionManager } from "components/_app/Web3ConnectionManager/Web3ConnectionManager"
import { fuelConfig } from "fuelConfig"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import { Toaster } from "./ui/Toaster"

const queryClient = new QueryClient()

// TODO: add AppErrorBoundary
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      storageKey="chakra-ui-color-mode"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SWRConfig value={{ fetcher: fetcherForSWR }}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <QueryClientProvider client={queryClient}>
            <FuelProvider ui={false} fuelConfig={fuelConfig}>
              <PostHogProvider>
                <IntercomProvider>
                  {children}
                  <Web3ConnectionManager />
                </IntercomProvider>
              </PostHogProvider>
            </FuelProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SWRConfig>

      <Toaster />
    </ThemeProvider>
  )
}
