import { Icon, Link, Text } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chains } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
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
