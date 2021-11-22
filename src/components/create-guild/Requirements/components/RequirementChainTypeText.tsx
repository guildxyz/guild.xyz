import { Box, HStack, Img, Text, Tooltip, useColorMode } from "@chakra-ui/react"
import { RPC } from "connectors"
import {
  RequirementType,
  RequirementTypeColors,
  SupportedChains,
} from "temporaryData/types"
import { Rest } from "types"

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
      backgroundColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
      overflow="hidden"
      {...rest}
    >
      {["COIN", "ERC20", "ERC721"].includes(requirementType) && requirementChain && (
        <Box px={2}>
          <Tooltip label={requirementChain} hasArrow={true}>
            <Img src={RPC[requirementChain].iconUrls[0]} boxSize={4} />
          </Tooltip>
        </Box>
      )}
      <Text
        as="span"
        px={4}
        py={1}
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
