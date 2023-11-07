import { useColorMode } from "@chakra-ui/react"
import useFuel from "hooks/useFuel"
import { useMemo } from "react"
import { Connector, useAccount } from "wagmi"

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: evmConnectorFromHook } = useAccount()
  const { connectorName: fuelConnectorName, isConnected: isFuelConnected } =
    useFuel()

  const connector = connectorParam ?? evmConnectorFromHook

  const { colorMode } = useColorMode()

  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => typeof window !== "undefined" && window.ethereum?.isBraveWallet,
    [window?.ethereum]
  )

  const isOKXWallet = useMemo(
    () => typeof window !== "undefined" && !!window?.okxwallet,
    [window?.okxwallet]
  )

  const connectorIcon =
    connector?.id === "injected"
      ? isBraveWallet
        ? "brave.png"
        : isOKXWallet
        ? "okx.png"
        : "metamask.png"
      : connector?.id === "walletConnect"
      ? "walletconnect.svg"
      : connector?.id === "safe"
      ? colorMode === "dark"
        ? "gnosis-safe-white.svg"
        : "gnosis-safe-black.svg"
      : connector?.id === "coinbaseWallet"
      ? "coinbasewallet.png"
      : isFuelConnected
      ? "fuel.svg"
      : null

  return {
    connectorName:
      connector?.id === "injected"
        ? isBraveWallet
          ? "Brave"
          : isOKXWallet
          ? "OKX Wallet"
          : "MetaMask"
        : connector?.name ?? fuelConnectorName,
    connectorIcon,
  }
}

declare global {
  interface Window {
    okxwallet: any
  }
}

export default useConnectorNameAndIcon
