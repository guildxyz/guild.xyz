"use client"

import { FuelProvider } from "@fuels/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { fuelConfig } from "fuelConfig"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import { SWRConfig } from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import { AccountModal } from "../Account/components/AccountModal"
import { Web3ConnectionManager } from "../Web3ConnectionManager"
import { Toaster } from "../ui/Toaster"
import { IntercomProvider } from "./IntercomProvider"
import { PostHogProvider } from "./PostHogProvider"

const queryClient = new QueryClient()

// TODO: add AppErrorBoundary
export function Providers({ children }: { children: React.ReactNode }) {
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
                  <AccountModal />
                  <Suspense>
                    <Web3ConnectionManager />
                  </Suspense>
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
