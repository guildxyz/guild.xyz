import { Link } from "@chakra-ui/next-js"
import { Icon, Skeleton, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { CHAIN_CONFIG, Chain } from "wagmiConfig/chains"

type Props = {
  chain: Chain
  address: string
  path?: string
  isValidating?: boolean
}

const BlockExplorerLink = ({
  chain,
  address,
  path = "address",
  isValidating,
}: Props) => {
  const displayedAddress = address && shortenHex(address, 3)

  return (
    <Skeleton isLoaded={!isValidating} maxW="max-content" minW="80%">
      <Link
        href={`${CHAIN_CONFIG[chain].blockExplorerUrl}/${path}/${address}`}
        isExternal
      >
        <Text as="span" fontSize="md" mr={1.5} colorScheme="gray" noOfLines={1}>
          {displayedAddress}
        </Text>
        <Icon as={ArrowSquareOut} color="gray" />
      </Link>
    </Skeleton>
  )
}

export default BlockExplorerLink
