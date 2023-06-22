import { Icon, Skeleton, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Chain, RPC } from "connectors"
import { ArrowSquareOut } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  chain: Chain
  address: string
  label: string
  isValidating?: boolean
  error?: any
}

const BlockExplorerLink = ({
  chain,
  address,
  label,
  isValidating,
  error,
}: Props) => {
  const displayedAddress = useBreakpointValue({
    base: address ? shortenHex(address) : "",
    lg: address,
  })
  const url = RPC[chain]?.blockExplorerUrls?.[0]

  return (
    <Stack spacing={0}>
      <Text
        as="span"
        fontSize="sm"
        fontWeight="bold"
        colorScheme="gray"
        textTransform="uppercase"
      >
        {label}
      </Text>

      <Skeleton isLoaded={!isValidating} maxW="max-content" minW="80%">
        {error ? (
          <Text as="span" fontSize="md" colorScheme="gray">
            Couldn't fetch
          </Text>
        ) : (
          <Link href={`${url}/address/${address}`} colorScheme="gray" isExternal>
            <Text as="span" fontSize="md" mr={1.5}>
              {displayedAddress}
            </Text>
            <Icon as={ArrowSquareOut} color="gray" size="sm" />
          </Link>
        )}
      </Skeleton>
    </Stack>
  )
}

export default BlockExplorerLink
