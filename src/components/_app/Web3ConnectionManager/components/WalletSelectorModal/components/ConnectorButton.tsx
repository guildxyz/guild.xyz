import { ButtonProps, Center, Icon, Img } from "@chakra-ui/react"
import { Wallet } from "@phosphor-icons/react"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import Button from "components/common/Button"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import { useAtomValue, useSetAtom } from "jotai"
import { isIOS } from "react-device-detect"
import { useAccount, type Connector } from "wagmi"
import { walletLinkHelperModalAtom } from "../../WalletLinkHelperModal"
import { COINBASE_WALLET_SDK_ID } from "../WalletSelectorModal"

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

        // Note: This is needed to ensure, the Smart Wallet popup opens on iOS
        // Because the window.open call within the CB SDK gets blocked
        if (isIOS && connector?.id === "coinbaseWalletSDK") {
          window.open("", "Smart Wallet")
        }
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
      {connector?.id === COINBASE_WALLET_SDK_ID
        ? `Sign in with ${connectorName}`
        : connectorName}
    </Button>
  )
}

export { connectorButtonProps }
export default ConnectorButton
