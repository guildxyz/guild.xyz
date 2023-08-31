import { Center, Img, useColorMode } from "@chakra-ui/react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { Web3ReactHooks, useWeb3React } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"
import { MetaMask } from "@web3-react/metamask"
import { WalletConnect } from "@web3-react/walletconnect-v2"
import useKeyPair from "components/_app/useKeyPairContext"
import Button from "components/common/Button"
import GuildAvatar from "components/common/GuildAvatar"
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { WalletError } from "types"
import shortenHex from "utils/shortenHex"

type Props = {
  connector: MetaMask | WalletConnect | CoinbaseWallet | GnosisSafe
  connectorHooks: Web3ReactHooks
  error: WalletError & Error
  setError: Dispatch<SetStateAction<WalletError & Error>>
}

const ConnectorButton = ({
  connector,
  connectorHooks,
  error,
  setError,
}: Props): JSX.Element => {
  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  const {
    connector: activeConnector,
    account,
    isActive: isAnyConnectorActive,
  } = useWeb3React()
  const { useIsActive } = connectorHooks
  const isActive = useIsActive()
  const { ready } = useKeyPair()

  const [isActivating, setIsActivating] = useState(false)

  const activate = () => {
    setError(null)
    setIsActivating(true)
    activeConnector?.deactivate?.()
    connector
      .activate()
      .catch((err) => setError(err))
      .finally(() => setIsActivating(false))
  }

  const isMetaMaskInstalled = typeof window !== "undefined" && !!window.ethereum
  // wrapping with useMemo to make sure it updates on window.ethereum change
  const isBraveWallet = useMemo(
    () => typeof window !== "undefined" && (window.ethereum as any)?.isBraveWallet,
    [window?.ethereum]
  )
  const { colorMode } = useColorMode()

  const iconUrl =
    connector instanceof MetaMask
      ? isBraveWallet
        ? "brave.png"
        : "metamask.png"
      : connector instanceof WalletConnect
      ? "walletconnect.svg"
      : connector instanceof GnosisSafe
      ? colorMode === "dark"
        ? "gnosis-safe-white.svg"
        : "gnosis-safe-black.svg"
      : "coinbasewallet.png"

  const connectorName =
    connector instanceof MetaMask
      ? isBraveWallet
        ? "Brave Wallet"
        : isMetaMaskInstalled
        ? "MetaMask"
        : "Install MetaMask"
      : connector instanceof WalletConnect
      ? "WalletConnect"
      : connector instanceof GnosisSafe
      ? "Gnosis Safe"
      : "Coinbase Wallet"

  if (connector instanceof MetaMask && isMobile && !isMetaMaskInstalled) return null

  if (account && !isActive && ready && isAnyConnectorActive) return null

  return (
    <Button
      mb="4"
      onClick={
        connector instanceof MetaMask && !isMetaMaskInstalled
          ? handleOnboarding
          : activate
      }
      rightIcon={
        isActive && ready ? (
          <GuildAvatar address={account} size={5} />
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
        isActivating ||
        (account && isActive && !ready) ||
        (isActive && activeConnector.constructor === connector.constructor)
      }
      isLoading={(isActivating || (account && isActive && !ready)) && !error}
      spinnerPlacement="end"
      loadingText={`${connectorName} - connecting...`}
      w="full"
      size="xl"
      justifyContent="space-between"
      border={isActive && "2px"}
      borderColor="primary.500"
    >
      {!account || !isActive ? `${connectorName}` : shortenHex(account)}
    </Button>
  )
}

export default ConnectorButton
