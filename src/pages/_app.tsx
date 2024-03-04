import { Box, Progress, Slide, useColorMode } from "@chakra-ui/react"
import { FuelProvider } from "@fuel-wallet/react"
import AppErrorBoundary from "components/_app/AppErrorBoundary"
import Chakra from "components/_app/Chakra"
import ExplorerProvider from "components/_app/ExplorerProvider"
import IntercomProvider from "components/_app/IntercomProvider"
import { PostHogProvider } from "components/_app/PostHogProvider"
import Web3ConnectionManager from "components/_app/Web3ConnectionManager"
import ClientOnly from "components/common/ClientOnly"
import AccountModal from "components/common/Layout/components/Account/components/AccountModal"
import { connectors, publicClient } from "connectors"
import { dystopian, inter } from "fonts"
import { useAtomValue } from "jotai"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import Script from "next/script"
import { IconContext } from "phosphor-react"
import { useEffect, useState } from "react"
import { SWRConfig } from "swr"
import "theme/custom-scrollbar.css"
import { fetcherForSWR } from "utils/fetcher"
import { shouldUseReCAPTCHAAtom } from "utils/recaptcha"
import { WagmiConfig, createConfig } from "wagmi"

/**
 * Polyfill HTML inert property for Firefox support:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert#browser_compatibility
 */
import "wicg-inert"

const config = createConfig({
  autoConnect: !process.env.NEXT_PUBLIC_MOCK_CONNECTOR,
  publicClient,
  connectors,
})

const DynamicReCAPTCHA = dynamic(() => import("components/common/ReCAPTCHA"))

const App = ({
  Component,
  pageProps,
}: AppProps<{ cookies: string }>): JSX.Element => {
  const router = useRouter()
  const shouldUseReCAPTCHA = useAtomValue(shouldUseReCAPTCHAAtom)

  const [isRouteChangeInProgress, setIsRouteChangeInProgress] = useState(false)
  const { colorMode } = useColorMode()

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
      <Script src="/intercom.js" />

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
            <WagmiConfig config={config}>
              <FuelProvider>
                <PostHogProvider>
                  <IntercomProvider>
                    <ExplorerProvider>
                      <AppErrorBoundary>
                        <Component {...pageProps} />
                      </AppErrorBoundary>

                      <ClientOnly>
                        <AccountModal />
                      </ClientOnly>
                    </ExplorerProvider>
                  </IntercomProvider>

                  <Web3ConnectionManager />
                </PostHogProvider>
              </FuelProvider>
            </WagmiConfig>
          </SWRConfig>
        </IconContext.Provider>
      </Chakra>
    </>
  )
}

export { getServerSideProps } from "components/_app/Chakra"

export default App
