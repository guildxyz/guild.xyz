import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import { Web3ConnectionManager } from "components/web3Connection/Web3ConnectionManager"
import Chakra from "components/_app/Chakra"
import "focus-visible/dist/focus-visible"
import type { AppProps } from "next/app"
import { IconContext } from "phosphor-react"

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) =>
  new Web3Provider(provider)

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <Chakra cookies={pageProps.cookies}>
    <IconContext.Provider
      value={{
        color: "currentColor",
        size: "1em",
        weight: "bold",
        mirrored: false,
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ConnectionManager>
          <Component {...pageProps} />
        </Web3ConnectionManager>
      </Web3ReactProvider>
    </IconContext.Provider>
  </Chakra>
)

export { getServerSideProps } from "components/_app/Chakra"

export default App
