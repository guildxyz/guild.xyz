import { Anchor } from "@/components/ui/Anchor"
import { useChainId } from "wagmi"
import { CHAIN_CONFIG, Chains } from "wagmiConfig/chains"
import { useTransactionStatusContext } from "../../TransactionStatusContext"

const TransactionLink = (): JSX.Element => {
  const chainId = useChainId()
  const { txHash } = useTransactionStatusContext()

  return (
    <Anchor
      showExternal
      target="_blank"
      href={`${CHAIN_CONFIG[Chains[chainId]].blockExplorerUrl}/tx/${txHash}`}
      variant="muted"
      className="mb-6"
    >
      View on block explorer
    </Anchor>
  )
}

export { TransactionLink }
