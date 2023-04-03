import { Icon, Link, Text } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Chains, RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const TransactionLink = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const { txHash } = useGuildCheckoutContext()

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${RPC[Chains[chainId]].blockExplorerUrls[0]}/tx/${txHash}`}
        fontWeight="semibold"
      >
        View on block explorer
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default TransactionLink
