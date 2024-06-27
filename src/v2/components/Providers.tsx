"use client"

import { FuelProvider } from "@fuels/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { PostHogProvider } from "components/_app/PostHogProvider"
import { fuelConfig } from "fuelConfig"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"

const queryClient = new QueryClient()

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
                {children}
                {/* <Web3ConnectionManager /> */}
              </PostHogProvider>
            </FuelProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SWRConfig>
    </ThemeProvider>
  )
}
