import { FuelProvider } from "@fuels/react"
import { IconContext } from "@phosphor-icons/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { bugsnagStart } from "bugsnag"
import Chakra from "components/_app/Chakra"
import ClientOnly from "components/common/ClientOnly"
import { env } from "env"
import { dystopian, inter } from "fonts"
import { fuelConfig } from "fuelConfig"
import useOAuthResultToast from "hooks/useOAuthResultToast"
import { useAtomValue } from "jotai"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import { SWRConfig } from "swr"
import { fetcherForSWR } from "utils/fetcher"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"
import "../app/globals.css"
import { AccountModal } from "@/components/Account/components/AccountModal"
import { PurchaseHistoryDrawer } from "@/components/Account/components/PurchaseHistoryDrawer/PurchaseHistoryDrawer"
import AppErrorBoundary from "@/components/AppErrorBoundary"
import { IntercomProvider } from "@/components/Providers/IntercomProvider"
import { TermsOfUseUpdateDialog } from "@/components/TermsOfUseUpdateDialog"
import { Toaster } from "@/components/ui/Toaster"
import { TooltipProvider } from "@/components/ui/Tooltip"
import { LegacyPostHogProvider } from "components/_app/LegacyPostHogProvider"
import { LegacyWeb3ConnectionManager } from "components/_app/LegacyWeb3ConnectionManager"
import Head from "next/head"
import Script from "next/script"
import NextTopLoader from "nextjs-toploader"

const DynamicReCAPTCHA = dynamic(() => import("v2/components/ReCAPTCHA"))

const queryClient = new QueryClient()

bugsnagStart()

const App = ({
  Component,
  pageProps,
}: AppProps<{ cookies: string }>): JSX.Element => {
  const shouldUseReCAPTCHA = useAtomValue(shouldUseReCAPTCHAAtom)

  useOAuthResultToast()

  return (
    <>
      <Head>
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              async
              defer
              src="/js/script.js"
              data-api="/api/event"
              data-domain="guild.xyz"
              integrity="sha512-HVRUd9pld7dyE4GD9bua0YojsAokMtFExYGvwJhJ5zq37EEX7yEOeYEsh0yh/CypC832F1VkewDepCdoDlPwEw=="
              data-exclude="/oauth**"
            />
            <Script
              async
              defer
              src="https://js.jam.dev/support/d00eb75d-44cf-48af-a274-ae7c828bb08e.js"
            />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@guildxyz" />
      </Head>

      <style jsx global>
        {`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-dystopian: ${dystopian.style.fontFamily};
          }
        `}
      </style>

      {shouldUseReCAPTCHA && (
        <DynamicReCAPTCHA
          sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}

      <NextTopLoader showSpinner={false} color="#eff6ff" height={3} />

      <Chakra cookies={pageProps.cookies}>
        <TooltipProvider>
          <IconContext.Provider
            value={{
              color: "currentColor",
              size: "1em",
              weight: "bold",
              mirrored: false,
            }}
          >
            <SWRConfig value={{ fetcher: fetcherForSWR }}>
              <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
                <QueryClientProvider client={queryClient}>
                  <FuelProvider ui={false} fuelConfig={fuelConfig}>
                    <LegacyPostHogProvider>
                      <IntercomProvider>
                        <AppErrorBoundary>
                          <Component {...pageProps} />
                        </AppErrorBoundary>

                        <ClientOnly>
                          <AccountModal />
                          <PurchaseHistoryDrawer />
                        </ClientOnly>
                      </IntercomProvider>

                      <LegacyWeb3ConnectionManager />
                      <TermsOfUseUpdateDialog />
                    </LegacyPostHogProvider>
                  </FuelProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </SWRConfig>

            <Toaster />
          </IconContext.Provider>
        </TooltipProvider>

        <div
          id="chakra-react-select-portal"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            width: 0,
            height: 0,
          }}
        />
        <canvas
          id="js-confetti-canvas"
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            zIndex: 10001,
            pointerEvents: "none",
          }}
        />
      </Chakra>
    </>
  )
}

export { getServerSideProps } from "components/_app/Chakra"
export default App
