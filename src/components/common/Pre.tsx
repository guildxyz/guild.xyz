import { Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const Pre = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
  <Text
    as="span"
    display="inline-block"
    px={1.5}
    py={0.5}
    bgColor="blackAlpha.300"
    borderRadius="sm"
    fontSize="sm"
    fontFamily="pre"
    wordBreak="break-word"
  >
    {children}
  </Text>
)

export default Pre
