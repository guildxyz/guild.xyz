import { ButtonProps, Center, Icon, Img } from "@chakra-ui/react"
import MetaMaskOnboarding from "@metamask/onboarding"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import Button from "components/common/Button"
import { Wallet } from "phosphor-react"
import { useRef } from "react"
import { isMobile } from "react-device-detect"
import { Connector, useAccount } from "wagmi"

type Props = {
  connector: Connector
  pendingConnector: Connector
  isLoading: boolean
  connect: (args) => void
  error?: Error
}

const connectorButtonProps: ButtonProps = {
  spinnerPlacement: "end",
  w: "full",
  size: "xl",
  iconSpacing: 4,
  justifyContent: "start",
  // Yeah.. This is not a pretty solution, but the simplest extra-markup-free one, I could find, as the spinner is conviniently already wrapped in a flex container
  sx: {
    "> div.chakra-button__spinner": {
      flexGrow: 1,
      justifyContent: "end",
    },
  },
}

const ConnectorButton = ({
  connector,
  pendingConnector,
  isLoading,
  connect,
  error,
}: Props): JSX.Element => {
  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>()
  if (typeof window !== "undefined") {
    onboarding.current = new MetaMaskOnboarding()
  }
  const handleOnboarding = () => onboarding.current?.startOnboarding()

  const { isConnected, connector: activeConnector } = useAccount()

  const { keyPair, id } = useUserPublic()

  const isMetaMaskInstalled = typeof window !== "undefined" && !!window.ethereum

  const { connectorName, connectorIcon } = useConnectorNameAndIcon(connector)

  if (connector.id === "injected" && isMobile && !isMetaMaskInstalled) return null

  return (
    <Button
      mb="4"
      onClick={
        connector.id === "injected" && !isMetaMaskInstalled
          ? handleOnboarding
          : () => connect({ connector })
      }
      leftIcon={
        connectorIcon ? (
          <Center boxSize={6}>
            <Img
              src={`/walletLogos/${connectorIcon}`}
              maxW={6}
              maxH={6}
              alt={`${connectorName} logo`}
            />
          </Center>
        ) : (
          <Icon as={Wallet} boxSize={6} />
        )
      }
      isDisabled={activeConnector?.id === connector.id}
      isLoading={
        ((isLoading && pendingConnector?.id === connector.id) ||
          (isConnected && activeConnector?.id === connector.id && !keyPair)) &&
        !error
      }
      loadingText={`${connectorName} - connecting...`}
      {...connectorButtonProps}
    >
      {connectorName}
    </Button>
  )
}

export { connectorButtonProps }
export default ConnectorButton
