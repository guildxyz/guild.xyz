import { useColorMode } from "@chakra-ui/react"
import { useIsConnected } from "@fuel-wallet/react"
import { useAccount, type Connector } from "wagmi"

const CUSTOM_CONNECTOR_ICONS: Record<
  string,
  {
    light: string
    dark: string
  }
> = {
  "com.brave.wallet": {
    light: "/walletLogos/brave.png",
    dark: "/walletLogos/brave.png",
  },
  walletConnect: {
    light: "/walletLogos/walletconnect.svg",
    dark: "/walletLogos/walletconnect.svg",
  },
  safe: {
    light: "/walletLogos/gnosis-safe-black.svg",
    dark: "/walletLogos/gnosis-safe-white.svg",
  },
  coinbaseWalletSDK: {
    light: "/walletLogos/coinbasewallet.png",
    dark: "/walletLogos/coinbasewallet.png",
  },
}

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: evmConnectorFromHook } = useAccount()
  const { isConnected: isFuelConnected } = useIsConnected()

  const connector = connectorParam ?? evmConnectorFromHook

  const { colorMode } = useColorMode()

  const connectorIcon =
    CUSTOM_CONNECTOR_ICONS[connector?.id]?.[colorMode] ??
    connector?.icon ??
    (isFuelConnected ? "/walletLogos/fuel.svg" : null)

  return {
    connectorName:
      connector?.name === "Injected"
        ? "Injected Wallet"
        : connector?.name || (isFuelConnected ? "Fuel" : ""),
    connectorIcon,
  }
}

declare global {
  interface Window {
    okxwallet: any
  }
}

export default useConnectorNameAndIcon
