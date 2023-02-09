import { Icon, Link, Text } from "@chakra-ui/react"
import { RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { useGuildCheckoutContext } from "../../GuildCheckoutContex"

type Props = {
  tx: string
}

const TransactionLink = ({ tx }: Props): JSX.Element => {
  const { requirement } = useGuildCheckoutContext()
  return (
    <Text mb={6} colorScheme="gray">
      {"Transaction id: "}
      <Link
        isExternal
        href={`${RPC[requirement.chain].blockExplorerUrls[0]}/tx/${tx}`}
        fontWeight="semibold"
      >
        {`${shortenHex(tx, 3)}`}
        <Icon ml={1} as={ArrowSquareOut} />
      </Link>
    </Text>
  )
}

export default TransactionLink
