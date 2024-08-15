import { Divider, Flex, HStack, useColorMode } from "@chakra-ui/react"
import { Logic } from "@guildxyz/types"
import { Rest } from "types"

type Props = { logic: Logic } & Rest

export const formattedLogic: Record<Logic, string> = {
  AND: "AND",
  OR: "OR",
  ANY_OF: "OR",
}

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
        flexShrink={0}
      >
        {formattedLogic[logic]}
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
    </HStack>
  )
}

export default LogicDivider
