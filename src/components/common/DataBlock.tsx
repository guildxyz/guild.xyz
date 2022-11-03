import { Skeleton, Text, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type Props = {
  isLoading?: boolean
}

const DataBlock = ({
  isLoading,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

  if (isLoading) return <Skeleton as="span">Loading...</Skeleton>

  return (
    <Text
      as="span"
      px={1.5}
      py={0.5}
      bgColor={bg}
      borderRadius="sm"
      fontSize="sm"
      fontFamily="SFMono-Regular,Menlo,Monaco,Consolas,monospace"
      wordBreak="break-word"
    >
      {children}
    </Text>
  )
}

export default DataBlock
