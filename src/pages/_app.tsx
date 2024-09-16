import { FuelProvider } from "@fuels/react"
import { IconContext } from "@phosphor-icons/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
/**
 * Polyfill HTML inert property for Firefox support:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert#browser_compatibility
 */
import { AccountModal } from "@/components/Account/components/AccountModal"
import { IntercomProvider } from "@/components/Providers/IntercomProvider"
import { Toaster } from "@/components/ui/Toaster"
import { LegacyPostHogProvider } from "components/_app/LegacyPostHogProvider"
import { LegacyWeb3ConnectionManager } from "components/_app/LegacyWeb3ConnectionManager"
import "wicg-inert"
import AppErrorBoundary from "@/components/AppErrorBoundary"
import { TooltipProvider } from "@/components/ui/Tooltip"
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
                        </ClientOnly>
                      </IntercomProvider>

                      <LegacyWeb3ConnectionManager />
                    </LegacyPostHogProvider>
                  </FuelProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </SWRConfig>

            <Toaster />
          </IconContext.Provider>
        </TooltipProvider>
      </Chakra>

      <SpeedInsights />
    </>
  )
}

export { getServerSideProps } from "components/_app/Chakra"
export default App
