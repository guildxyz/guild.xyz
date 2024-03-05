import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import useFuel from "hooks/useFuel"
import { useMemo } from "react"
import { Connector, useAccount } from "wagmi"

const useConnectorNameAndIcon = (connectorParam?: Connector) => {
  const { connector: evmConnectorFromHook } = useAccount()
  const { connectorName: fuelConnectorName, isConnected: isFuelConnected } =
    useFuel()
  const connector = connectorParam ?? evmConnectorFromHook
  console.log("connectorParam", connectorParam)

  const { colorMode } = useColorMode()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _window = typeof window === "undefined" ? ({} as any) : window
  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => _window.ethereum?.isBraveWallet,
    [_window.ethereum]
  )
  const isOKXWallet = useMemo(() => !!_window.okxwallet, [_window.okxwallet])

  const isFueletWallet = useMemo(() => !!_window.fuelet, [_window.fuelet])
  const fueletLogo = useColorModeValue("fuelet-black.svg", "fuelet-white.svg")

  const connectorIcon =
    connector?.id === "injected"
      ? isBraveWallet
        ? "brave.png"
        : isOKXWallet
        ? "okx.png"
        : "metamask.png"
      : connector?.id === "ronin"
      ? "ronin.png"
      : connector?.id === "rabby"
      ? "rabby.png"
      : connector?.id === "walletConnect"
      ? "walletconnect.svg"
      : connector?.id === "safe"
      ? colorMode === "dark"
        ? "gnosis-safe-white.svg"
        : "gnosis-safe-black.svg"
      : connector?.id === "coinbaseWallet"
      ? "coinbasewallet.png"
      : isFuelConnected
      ? isFueletWallet
        ? fueletLogo
        : "fuel.svg"
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

export default useConnectorNameAndIcon
