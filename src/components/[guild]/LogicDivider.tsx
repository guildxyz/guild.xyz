import { Divider, Flex, useColorMode } from "@chakra-ui/react"

type Props = {
  logic: string
}

const LogicDivider = ({ logic }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Flex px={4} py={1} width="full" alignItems="center" justifyContent="center">
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
      <Flex
        px={4}
        alignItems="center"
        justifyContent="center"
        fontSize="sm"
        fontWeight="bold"
        color={colorMode === "light" ? "blackAlpha.500" : "whiteAlpha.400"}
      >
        {logic}
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
    </Flex>
  )
}

export default LogicDivider
