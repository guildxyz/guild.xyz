import { Icon, Link, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "@phosphor-icons/react"
import { CHAIN_CONFIG, Chains } from "chains"
import { useChainId } from "wagmi"
import { useTransactionStatusContext } from "../../TransactionStatusContext"

const TransactionLink = (): JSX.Element => {
  const chainId = useChainId()
  const { txHash } = useTransactionStatusContext()

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${
          CHAIN_CONFIG[Chains[chainId]].blockExplorers.default.url
        }/tx/${txHash}`}
      >
        View on block explorer
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default TransactionLink
