/* eslint-disable react/jsx-props-no-spreading */
import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import "focus-visible/dist/focus-visible"
import theme from "theme"
import { Web3ConnectionManager } from "modules/web3Connection"
import { IconContext } from "phosphor-react"

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider)
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
  )
}
