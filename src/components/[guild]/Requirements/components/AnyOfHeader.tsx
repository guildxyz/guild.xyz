import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react"

type Props = {
  anyOfNum?: number
}

const AnyOfHeader = ({ anyOfNum }: Props): JSX.Element => {
  const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.400")
  const textColor = useColorModeValue("blackAlpha.500", "whiteAlpha.400")

  return (
    <HStack py={3} width="full" spacing={4}>
      <Box
        width="full"
        h={4}
        borderColor={borderColor}
        borderTopWidth={1}
        borderTopLeftRadius="xl"
      />
      <Text
        position="relative"
        top={-2}
        as="span"
        fontSize="xs"
        fontWeight="bold"
        color={textColor}
        flexShrink={0}
      >
        {`ANY ${anyOfNum} OF`}
      </Text>
      <Box
        width="full"
        h={4}
        borderColor={borderColor}
        borderTopWidth={1}
        borderTopRightRadius="xl"
      />
    </HStack>
  )
}

export default AnyOfHeader
