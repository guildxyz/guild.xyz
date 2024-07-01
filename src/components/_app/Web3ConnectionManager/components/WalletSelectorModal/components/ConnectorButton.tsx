import { Button, ButtonProps } from "@/components/ui/Button"
import { useUserPublic } from "components/[guild]/hooks/useUser"
import useConnectorNameAndIcon from "components/_app/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { addressLinkParamsAtom } from "components/common/Layout/components/Account/components/AccountModal/components/LinkAddressButton"
import { useAtomValue, useSetAtom } from "jotai"
import { Wallet } from "phosphor-react"
import { Config, useAccount, type Connector } from "wagmi"
import { ConnectMutate } from "wagmi/query"
import { walletLinkHelperModalAtom } from "../../WalletLinkHelperModal"
import { COINBASE_WALLET_SDK_ID } from "../constants"

type Props = {
  connector?: Connector
  pendingConnector?: Connector
  connect: ConnectMutate<Config, unknown>
  error: Error | null
}

export const connectorButtonBaseProps = {
  variant: "secondary",
  size: "xl",
  className: "flex w-full justify-start gap-2",
} satisfies ButtonProps

const ConnectorButton = ({ connector, pendingConnector, connect, error }: Props) => {
  const { isConnected, connector: activeConnector } = useAccount()

  const { keyPair } = useUserPublic()

  const { connectorName, connectorIcon } = useConnectorNameAndIcon(connector)

  const addressLinkParams = useAtomValue(addressLinkParamsAtom)
  const setIsWalletLinkHelperModalOpen = useSetAtom(walletLinkHelperModalAtom)

  if (!connector) return null

  return (
    <Button
      {...connectorButtonBaseProps}
      onClick={() => {
        if (addressLinkParams?.userId) setIsWalletLinkHelperModalOpen(true)
        connect({ connector })
      }}
      disabled={activeConnector?.id === connector.id}
      isLoading={
        (pendingConnector?.id === connector.id ||
          (isConnected && activeConnector?.id === connector.id && !keyPair)) &&
        !error
      }
      loadingText={`${connectorName} - connecting...`}
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
