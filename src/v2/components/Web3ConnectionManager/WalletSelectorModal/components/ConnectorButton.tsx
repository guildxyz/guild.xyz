import {
  addressLinkParamsAtom,
  walletLinkHelperModalAtom,
} from "@/components/Providers/atoms"
import { Button, ButtonProps } from "@/components/ui/Button"
import useConnectorNameAndIcon from "@/components/Web3ConnectionManager/hooks/useConnectorNameAndIcon"
import { useUserPublic } from "@/hooks/useUserPublic"
import { Wallet } from "@phosphor-icons/react/dist/ssr"
import { useAtomValue, useSetAtom } from "jotai"
import { Config, useAccount, type Connector } from "wagmi"
import { ConnectMutate } from "wagmi/query"
import { COINBASE_WALLET_SDK_ID } from "wagmiConfig"

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

  const isCurrentConnectorPending = pendingConnector?.id === connector.id
  const isCurrentConnectorActive =
    isConnected && activeConnector?.id === connector.id

  return (
    <Button
      {...connectorButtonBaseProps}
      onClick={() => {
        if (addressLinkParams?.userId) setIsWalletLinkHelperModalOpen(true)
        connect({ connector })
      }}
      disabled={activeConnector?.id === connector.id}
      isLoading={
        (isCurrentConnectorPending || (isCurrentConnectorActive && !keyPair)) &&
        !error
      }
      loadingText={`${connectorName} - connecting...`}
    >
      {connectorIcon ? (
        <div className="flex size-6 items-center justify-center">
          <img src={connectorIcon} className="h-6" alt={`${connectorName} logo`} />
        </div>
      ) : (
        <Wallet weight="bold" className="size-6" />
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
