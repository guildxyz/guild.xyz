import { Center, HStack, Img, Text, Tooltip, useColorMode } from "@chakra-ui/react"
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
    <HStack
      spacing={0}
      position="absolute"
      h={7}
      overflow="hidden"
      alignItems="stretch"
      {...rest}
    >
      {["COIN", "ERC20", "ERC721", "ERC1155"].includes(requirementType) &&
        requirementChain && (
          <Center
            pl={2}
            pr={5}
            mr="-3"
            mb="1px"
            backgroundColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
          >
            <Tooltip label={requirementChain}>
              <Img src={RPC[requirementChain]?.iconUrls?.[0]} boxSize={4} />
            </Tooltip>
          </Center>
        )}
      <Text
        as="span"
        px={4}
        py={1}
        backgroundColor={RequirementTypeColors[requirementType]}
        color={requirementType === "ALLOWLIST" ? "gray.700" : "blackAlpha.600"}
        fontSize="sm"
        textTransform="uppercase"
        fontWeight="extrabold"
        borderTopLeftRadius="xl"
      >
        {requirementType === "ERC721" || requirementType === "ERC1155"
          ? "NFT"
          : requirementType}
      </Text>
    </HStack>
  )
}

export default RequirementChainTypeText
