import { Web3ReactProvider } from "@web3-react/core"
import Chakra from "components/_app/Chakra"
import Datadog from "components/_app/Datadog"
import ExplorerProvider from "components/_app/ExplorerProvider"
import IntercomProvider from "components/_app/IntercomProvider"
import { Web3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { connectors } from "connectors"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import Script from "next/script"
import { IconContext } from "phosphor-react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { Fragment, useEffect } from "react"
import { SWRConfig } from "swr"
import "theme/custom-scrollbar.css"
import fetcher from "utils/fetcher"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Disable in development
    loaded: (ph) => {
      // if (process.env.NODE_ENV === 'development') ph.opt_out_capturing()
    },
  })
}

const App = ({
  Component,
  pageProps,
}: AppProps<{ cookies: string }>): JSX.Element => {
  const router = useRouter()

  // PostHog - Track page views
  useEffect(() => {
    const handleRouteChange = () => posthog.capture("$pageview")
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  const DatadogComponent = router.asPath.includes("linkpreview") ? Fragment : Datadog

  return (
    <>
      <Script src="/intercom.js" />
      <Chakra cookies={pageProps.cookies}>
        <IconContext.Provider
          value={{
            color: "currentColor",
            size: "1em",
            weight: "bold",
            mirrored: false,
          }}
        >
          <SWRConfig value={{ fetcher }}>
            <Web3ReactProvider connectors={connectors}>
              <Web3ConnectionManager>
                <DatadogComponent>
                  <PostHogProvider client={posthog}>
                    <IntercomProvider>
                      <ExplorerProvider>
                        <Component {...pageProps} />
                      </ExplorerProvider>
                    </IntercomProvider>
                  </PostHogProvider>
                </DatadogComponent>
              </Web3ConnectionManager>
            </Web3ReactProvider>
          </SWRConfig>
        </IconContext.Provider>
      </Chakra>
    </>
  )
}

export { getServerSideProps } from "components/_app/Chakra"

export default App
