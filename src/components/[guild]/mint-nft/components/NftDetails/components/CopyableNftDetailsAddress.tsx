import {
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  useClipboard,
} from "@chakra-ui/react"
import { Copy } from "phosphor-react"
import shortenHex from "utils/shortenHex"

type Props = {
  label: string
  address: string
  isValidating?: boolean
  error?: any
}

const CopyableNftDetailsAddress = ({
  label,
  address,
  isValidating,
  error,
}: Props) => {
  const displayedAddress = useBreakpointValue({
    base: address ? shortenHex(address) : "",
    lg: address,
  })
  const { hasCopied, onCopy } = useClipboard(address)

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
          <HStack>
            <Text as="span" fontSize="md" colorScheme="gray">
              {displayedAddress}
            </Text>
            <Tooltip
              placement="top"
              label={hasCopied ? "Copied" : "Click to copy address"}
              closeOnClick={false}
              hasArrow
            >
              <IconButton
                aria-label="Copy contract address"
                variant="ghost"
                icon={<Copy />}
                color="gray"
                size="sm"
                rounded="full"
                onClick={onCopy}
              />
            </Tooltip>
          </HStack>
        )}
      </Skeleton>
    </Stack>
  )
}

export default CopyableNftDetailsAddress
