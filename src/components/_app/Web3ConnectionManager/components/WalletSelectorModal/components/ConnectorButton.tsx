import { Center, Img, useColorMode } from "@chakra-ui/react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useKeyPair } from "components/_app/KeyPairProvider"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import { useMemo, useRef } from "react"
import { isMobile } from "react-device-detect"
import shortenHex from "utils/shortenHex"
import { Connector, useAccount, useConnect } from "wagmi"

type Props = {
  connector: Connector
}

const ConnectorButton = ({ connector }: Props): JSX.Element => {
  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  const { address, isConnected, connector: activeConnector } = useAccount()
  const { connect, error, pendingConnector } = useConnect()

  const { ready } = useKeyPair()

  const isMetaMaskInstalled = typeof window !== "undefined" && !!window.ethereum
  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => typeof window !== "undefined" && (window.ethereum as any)?.isBraveWallet,
    [window?.ethereum]
  )
  const { colorMode } = useColorMode()

  const iconUrl =
    connector.id === "injected"
      ? isBraveWallet
        ? "brave.png"
        : "metamask.png"
      : connector.id === "walletConnect"
      ? "walletconnect.svg"
      : connector.id === "safe"
      ? colorMode === "dark"
        ? "gnosis-safe-white.svg"
        : "gnosis-safe-black.svg"
      : "coinbasewallet.png"
  // WAGMI TODO: the default value should be something else, not Coinbase Wallet
  // + maybe we could just define an object with connector ids as keys & icon names as values

  const connectorName =
    connector.id === "injected"
      ? isBraveWallet
        ? "Brave Wallet"
        : isMetaMaskInstalled
        ? "MetaMask"
        : "Install MetaMask"
      : connector.id === "walletConnect"
      ? "WalletConnect"
      : connector.id === "safe"
      ? "Gnosis Safe"
      : "Coinbase Wallet"
  // WAGMI TODO: the default value should be something else, not Coinbase Wallet

  if (connector.id === "injected" && isMobile && !isMetaMaskInstalled) return null

  if (!!activeConnector && connector.id !== activeConnector?.id && ready) return null

  return (
    <Button
      mb="4"
      onClick={
        connector.id === "injected" && !isMetaMaskInstalled
          ? handleOnboarding
          : () => connect({ connector })
      }
      rightIcon={
        connector && ready ? (
          <GuildAvatar address={address} size={5} />
        ) : (
          <Center boxSize={6}>
            <Img
              src={`/walletLogos/${iconUrl}`}
              maxW={6}
              maxH={6}
              alt={`${connectorName} logo`}
            />
          </Center>
        )
      }
      isDisabled={
        pendingConnector?.id === connector.id ||
        (address && activeConnector?.id === connector.id && !ready) ||
        activeConnector?.id === connector.id
      }
      isLoading={
        (pendingConnector?.id === connector.id ||
          (address && activeConnector?.id === connector.id && !ready)) &&
        !error
      }
      spinnerPlacement="end"
      loadingText={`${connectorName} - connecting...`}
      w="full"
      size="xl"
      justifyContent="space-between"
      border={activeConnector?.id === connector.id && "2px"}
      borderColor="primary.500"
    >
      {!address || !(activeConnector?.id === connector.id)
        ? `${connectorName}`
        : shortenHex(address)}
    </Button>
  )
}

export default ConnectorButton
