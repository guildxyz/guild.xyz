import { Icon, Link, Text } from "@chakra-ui/react"
import { RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

const TransactionLink = (): JSX.Element => {
  const { requirement, txHash } = useGuildCheckoutContext()

  return (
    <Text mb={6} colorScheme="gray">
      <Link
        isExternal
        href={`${RPC[requirement.chain].blockExplorerUrls[0]}/tx/${txHash}`}
        fontWeight="semibold"
      >
        View on block explorer
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default TransactionLink
