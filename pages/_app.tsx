/* eslint-disable react/jsx-props-no-spreading */
import type {
  ExternalProvider,
  JsonRpcFetchFunc,
} from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import "focus-visible/dist/focus-visible"

function getLibrary(provider: ExternalProvider | JsonRpcFetchFunc) {
  return new Web3Provider(provider)
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ChakraProvider>
  )
}
