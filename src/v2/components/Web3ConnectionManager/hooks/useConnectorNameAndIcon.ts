import { useIsConnected } from "@fuels/react"
import { useTheme } from "next-themes"
import { type Connector, useAccount } from "wagmi"
import { COINBASE_WALLET_SDK_ID } from "wagmiConfig"

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
  [COINBASE_WALLET_SDK_ID]: {
    light: "/walletLogos/coinbasewallet.png",
    dark: "/walletLogos/coinbasewallet.png",
  },
}

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: evmConnectorFromHook } = useAccount()
  const { isConnected: isFuelConnected } = useIsConnected()

  const connector = connectorParam ?? evmConnectorFromHook

  const { resolvedTheme } = useTheme()
  // Added a "light" fallback since we can't detect the Chakra color theme here.
  const connectorIcon =
    CUSTOM_CONNECTOR_ICONS[connector?.id]?.[resolvedTheme ?? "light"] ??
    connector?.icon ??
    (isFuelConnected ? "/walletLogos/fuel.svg" : null)

  return {
    connectorName:
      connector?.name === "Injected"
        ? "Injected Wallet"
        : connector?.id === "coinbaseWalletSDK"
          ? "Smart Wallet"
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
