import { Web3ReactProvider } from "@web3-react/core"
import Chakra from "components/_app/Chakra"
import Datadog from "components/_app/Datadog"
import { Web3ConnectionManager } from "components/_app/Web3ConnectionManager"
import { connectors } from "connectors"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { IconContext } from "phosphor-react"
import { Fragment } from "react"
import { SWRConfig } from "swr"
import "theme/custom-scrollbar.css"
import fetcher from "utils/fetcher"

const App = ({
  Component,
  pageProps,
}: AppProps<{ cookies: string }>): JSX.Element => {
  const router = useRouter()

  const DatadogComponent = router.asPath.includes("linkpreview") ? Fragment : Datadog

  return (
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
                <Component {...pageProps} />
              </DatadogComponent>
            </Web3ConnectionManager>
          </Web3ReactProvider>
        </SWRConfig>
      </IconContext.Provider>
    </Chakra>
  )
}

export { getServerSideProps } from "components/_app/Chakra"

export default App
