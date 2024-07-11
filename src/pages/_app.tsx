import { Box, Progress, Slide, useColorMode } from "@chakra-ui/react"
import { FuelProvider } from "@fuels/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { bugsnagStart } from "bugsnag"
import AppErrorBoundary from "components/_app/AppErrorBoundary"
import Chakra from "components/_app/Chakra"
import ClientOnly from "components/common/ClientOnly"
import { env } from "env"
import { dystopian, inter } from "fonts"
import { fuelConfig } from "fuelConfig"
import useOAuthResultToast from "hooks/useOAuthResultToast"
import { useAtomValue } from "jotai"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
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

const DynamicReCAPTCHA = dynamic(() => import("components/common/ReCAPTCHA"))

const queryClient = new QueryClient()

bugsnagStart()

const App = ({
  Component,
  pageProps,
}: AppProps<{ cookies: string }>): JSX.Element => {
  const router = useRouter()
  const shouldUseReCAPTCHA = useAtomValue(shouldUseReCAPTCHAAtom)

  const [isRouteChangeInProgress, setIsRouteChangeInProgress] = useState(false)
  const { colorMode } = useColorMode()

  useOAuthResultToast()

  useEffect(() => {
    let previousPathname = null

    const handleRouteChangeStart = (url: string) => {
      const pathname = url.split("?")[0]
      if (previousPathname !== pathname) setIsRouteChangeInProgress(true)
      previousPathname = pathname
    }
    const handleRouteChangeComplete = () => setIsRouteChangeInProgress(false)

    router.events.on("routeChangeStart", handleRouteChangeStart)
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart)
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <Chakra cookies={pageProps.cookies}>
        {isRouteChangeInProgress ? (
          <Slide
            direction="top"
            in={isRouteChangeInProgress}
            initial="0.3s"
            style={{ zIndex: 2000 }}
          >
            <Box position="relative" w="100%" h="5px" zIndex={2}>
              <Progress
                isIndeterminate
                w="100%"
                bg={colorMode === "light" ? "blue.50" : null}
                position="fixed"
                size="xs"
                transition="width .3s"
              />
            </Box>
          </Slide>
        ) : null}

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
      </Chakra>
    </>
  )
}

export { getServerSideProps } from "components/_app/Chakra"
export default App
