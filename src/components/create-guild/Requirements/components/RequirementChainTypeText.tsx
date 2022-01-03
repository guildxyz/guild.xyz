import { Flex, HStack, Img, Text, Tooltip, useColorMode } from "@chakra-ui/react"
import { RPC } from "connectors"
import { RequirementType, RequirementTypeColors, Rest, SupportedChains } from "types"

type Props = {
  requirementChain?: SupportedChains
  requirementType: RequirementType
} & Rest

const RequirementChainTypeText = ({
  requirementChain,
  requirementType,
  ...rest
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <HStack spacing={0} position="absolute" h={7} overflow="hidden" {...rest}>
      {["COIN", "ERC20", "ERC721"].includes(requirementType) && requirementChain && (
        <Flex
          alignItems="center"
          justifyContent="center"
          position="relative"
          mt={-0.5}
          mr={-5}
          pl={2}
          pr={7}
          h={7}
          backgroundColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
        >
          <Tooltip label={requirementChain}>
            <Img
              src={RPC[requirementChain].iconUrls[0]}
              position="relative"
              top="px"
              boxSize={4}
            />
          </Tooltip>
        </Flex>
      )}
      <Text
        as="span"
        position="relative"
        px={4}
        py={1}
        h={7}
        backgroundColor={RequirementTypeColors[requirementType]}
        color={requirementType === "WHITELIST" ? "gray.700" : "blackAlpha.600"}
        fontSize="sm"
        textTransform="uppercase"
        fontWeight="extrabold"
        borderTopLeftRadius="xl"
      >
        {requirementType}
      </Text>
    </HStack>
  )
}

export default RequirementChainTypeText
