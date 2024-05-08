import { ButtonProps, Center, Icon, Img } from "@chakra-ui/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import Button from "components/common/Button"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import { useAtomValue, useSetAtom } from "jotai"
import { Wallet } from "phosphor-react"
import { useAccount, type Connector } from "wagmi"
import { walletLinkHelperModalAtom } from "../../WalletLinkHelperModal"

type Props = {
  connector: Connector
  pendingConnector: Connector
  connect: (args) => void
  error?: Error
}

const connectorButtonProps: ButtonProps = {
  w: "full",
  size: "xl",
  iconSpacing: 4,
  justifyContent: "start",
  mb: 2.5,
  sx: {
    "> div.chakra-button__spinner": {
      boxSize: 6,
      justifyContent: "center",
    },
  },
}

const ConnectorButton = ({
  connector,
  pendingConnector,
  connect,
  error,
}: Props): JSX.Element => {
  const { isConnected, connector: activeConnector } = useAccount()

  const { keyPair } = useUserPublic()

  const { connectorName, connectorIcon } = useConnectorNameAndIcon(connector)

  const addressLinkParams = useAtomValue(addressLinkParamsAtom)
  const setIsWalletLinkHelperModalOpen = useSetAtom(walletLinkHelperModalAtom)

  return (
    <Button
      data-wagmi-connector-id={connector.id}
      onClick={() => {
        if (addressLinkParams?.userId) setIsWalletLinkHelperModalOpen(true)
        connect({ connector })
      }}
      leftIcon={
        connectorIcon ? (
          <Center boxSize={6}>
            <Img
              src={connectorIcon}
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
        (pendingConnector?.id === connector.id ||
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
