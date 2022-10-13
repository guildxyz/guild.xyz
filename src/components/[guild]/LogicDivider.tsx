import { Divider, Flex, HStack, useColorMode } from "@chakra-ui/react"
import { Rest } from "types"

type Props = {
  logic: string
} & Rest

const LogicDivider = ({ logic, ...rest }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <HStack py={3} width="full" {...rest} spacing={4}>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
      <Flex
        alignItems="center"
        justifyContent="center"
        fontSize="xs"
        fontWeight="bold"
        color={colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.400"}
      >
        {logic}
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
    </HStack>
  )
}

export default LogicDivider
