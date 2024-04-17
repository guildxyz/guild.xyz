import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"
import { Box, Progress, Slide, useColorMode } from "@chakra-ui/react"
import { FuelProvider } from "@fuel-wallet/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Chakra from "components/_app/Chakra"
import IntercomProvider from "components/_app/IntercomProvider"
import { PostHogProvider } from "components/_app/PostHogProvider"
import Web3ConnectionManager from "components/_app/Web3ConnectionManager"
import ClientOnly from "components/common/ClientOnly"
import AccountModal from "components/common/Layout/components/Account/components/AccountModal"
import { dystopian, inter } from "fonts"
import useOAuthResultToast from "hooks/useOAuthResultToast"
import { useAtomValue } from "jotai"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { IconContext } from "phosphor-react"
import React, { useEffect, useState } from "react"
import { SWRConfig } from "swr"
import "theme/custom-scrollbar.css"
import { fetcherForSWR } from "utils/fetcher"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { WagmiProvider } from "wagmi"
import { wagmiConfig } from "wagmiConfig"

/**
 * Polyfill HTML inert property for Firefox support:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert#browser_compatibility
 */
import "wicg-inert"

const queryClient = new QueryClient()

const DynamicReCAPTCHA = dynamic(() => import("components/common/ReCAPTCHA"))

Bugsnag.start({
  apiKey: "4bd5799ac2cb4a34887513b80b845554",
  plugins: [new BugsnagPluginReact()],
  endpoints: {
    notify: "/api/bugsnag/notify",
    sessions: "/api/bugsnag/sessions",
  },
})
const ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React)

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
  }, [router.events])

  return (
    <ErrorBoundary>
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
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}

      <Chakra cookies={pageProps.cookies}>
        {isRouteChangeInProgress ? (
          <Slide
            direction="top"
            in={isRouteChangeInProgress}
            initial="0.3s"
            style={{ zIndex: 10 }}
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
                <FuelProvider>
                  <PostHogProvider>
                    <IntercomProvider>
                      {/* <AppErrorBoundary> */}
                      <Component {...pageProps} />
                      {/* </AppErrorBoundary> */}

                      <ClientOnly>
                        <AccountModal />
                      </ClientOnly>
                    </IntercomProvider>

                    <Web3ConnectionManager />
                  </PostHogProvider>
                </FuelProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </SWRConfig>
        </IconContext.Provider>
      </Chakra>
    </ErrorBoundary>
  )
}

export { getServerSideProps } from "components/_app/Chakra"
export default App
