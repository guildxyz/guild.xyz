import { Icon, Skeleton, Text } from "@chakra-ui/react"
import { CHAIN_CONFIG, Chain } from "chains"
import Link from "components/common/Link"
import { ArrowSquareOut } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  chain: Chain
  address: string
  path?: string
  isValidating?: boolean
  error?: any
}

const BlockExplorerLink = ({
  chain,
  address,
  path = "address",
  isValidating,
  error,
}: Props) => {
  const displayedAddress = address && shortenHex(address, 3)

  return (
    <Skeleton isLoaded={!isValidating} maxW="max-content" minW="80%">
      {error ? (
        <Text as="span" fontSize="md" colorScheme="gray">
          Couldn't fetch
        </Text>
      ) : (
        <Link
          href={`${CHAIN_CONFIG[chain].blockExplorers.default.url}/${path}/${address}`}
          isExternal
        >
          <Text as="span" fontSize="md" mr={1.5} colorScheme="gray" noOfLines={1}>
            {displayedAddress}
          </Text>
          <Icon as={ArrowSquareOut} color="gray" />
        </Link>
      )}
    </Skeleton>
  )
}

export default BlockExplorerLink
