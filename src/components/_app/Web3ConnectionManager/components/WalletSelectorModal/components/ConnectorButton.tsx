import { Button } from "@/components/ui/Button"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import { useAtomValue, useSetAtom } from "jotai"
import { Wallet } from "phosphor-react"
import { Config, useAccount, type Connector } from "wagmi"
import { ConnectMutate } from "wagmi/query"
import { COINBASE_WALLET_SDK_ID } from "wagmiConfig"
import { walletLinkHelperModalAtom } from "../../WalletLinkHelperModal"

type Props = {
  connector?: Connector
  pendingConnector?: Connector
  connect: ConnectMutate<Config, unknown>
  error: Error | null
}

// const connectorButtonProps: ButtonProps = {
//   w: "full",
//   size: "xl",
//   iconSpacing: 4,
//   justifyContent: "start",
//   mb: 2.5,
//   sx: {
//     "> div.chakra-button__spinner": {
//       boxSize: 6,
//       justifyContent: "center",
//     },
//   },
// }

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
      variant="secondary"
      size="xl"
      className="flex w-full justify-start gap-2"
      onClick={() => {
        if (addressLinkParams?.userId) setIsWalletLinkHelperModalOpen(true)
        connect({ connector })
      }}
      // TODO
      // isDisabled={activeConnector?.id === connector.id}
      // isLoading={
      //   (pendingConnector?.id === connector.id ||
      //     (isConnected && activeConnector?.id === connector.id && !keyPair)) &&
      //   !error
      // }
      // loadingText={`${connectorName} - connecting...`}
      // {...connectorButtonProps}
    >
      {connectorIcon ? (
        <div className="flex size-6 items-center justify-center">
          <img src={connectorIcon} className="h-6" alt={`${connectorName} logo`} />
        </div>
      ) : (
        <Wallet className="size-6" />
      )}

      <span>
        {connector?.id === COINBASE_WALLET_SDK_ID
          ? `Sign in with ${connectorName}`
          : connectorName}
      </span>
    </Button>
  )
}

export default ConnectorButton
