import {
  Box,
  Icon,
  Skeleton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { Warning } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  isLoading?: boolean
  error?: string
}

const DataBlock = ({
  isLoading,
  error,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  if (isLoading) return <Skeleton as="span">Loading...</Skeleton>

  return (
    <Tooltip hasArrow placement="top" label={error} isDisabled={!error}>
      <Box
        display="inline"
        px={1.5}
        py={0.5}
        bgColor={bg}
        borderRadius="sm"
        fontSize="sm"
        wordBreak="break-word"
      >
        {error && (
          <Icon
            as={Warning}
            position="relative"
            top={0.5}
            mr={1}
            color="orange.200"
          />
        )}
        <Text as="span" fontFamily="SFMono-Regular,Menlo,Monaco,Consolas,monospace">
          {children}
        </Text>
      </Box>
    </Tooltip>
  )
}

export default DataBlock
