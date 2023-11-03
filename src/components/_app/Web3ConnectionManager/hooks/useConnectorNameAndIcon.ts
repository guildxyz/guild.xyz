import { useColorMode } from "@chakra-ui/react"
import { useMemo } from "react"
import { Connector, useAccount } from "wagmi"

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: connectorFromHook } = useAccount()

  const connector = connectorParam ?? connectorFromHook

  const { colorMode } = useColorMode()

  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => typeof window !== "undefined" && window.ethereum?.isBraveWallet,
    [window?.ethereum]
  )

  const isOKXWallet = useMemo(
    () => typeof window !== "undefined" && !!(window as any)?.okxwallet,
    [(window as any)?.okxwallet]
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
      : null

  return {
    connectorName:
      connector?.id === "injected"
        ? isBraveWallet
          ? "Brave"
          : isOKXWallet
          ? "OKX Wallet"
          : "MetaMask"
        : connector?.name,
    connectorIcon,
  }
}

export default useConnectorNameAndIcon
