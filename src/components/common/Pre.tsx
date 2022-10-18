import { Text, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const Pre = ({ children }: PropsWithChildren<unknown>): JSX.Element => {
  const bg = useColorModeValue("blackAlpha.100", "blackAlpha.300")

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

export default Pre
