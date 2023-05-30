import { Divider, Flex, Icon, useColorMode } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowDown, ArrowUp } from "phosphor-react"
import { Logic } from "types"

type Props = {
  logic: Logic
  hiddenRequirements: number
  isRequirementsExpanded: boolean
  onToggleExpanded: () => void
  isHidden?: boolean
}

const ExpandRequirementsButton = ({
  logic,
  hiddenRequirements,
  isRequirementsExpanded,
  onToggleExpanded,
  isHidden,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  if (isHidden) return null

  return (
    <Flex pt={3} width="full" alignItems="center" justifyContent="center">
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        opacity={isRequirementsExpanded ? 0 : 1}
        transition={`opacity .1s ${isRequirementsExpanded ? "" : "0.16s"}`}
      />
      <Flex
        px={4}
        alignItems="center"
        justifyContent="center"
        fontSize="xs"
        fontWeight="bold"
      >
        <Button
          w="full"
          size="xs"
          borderRadius="md"
          color={colorMode === "light" ? "blackAlpha.500" : "gray.400"}
          bg={colorMode === "light" ? "blackAlpha.50" : undefined}
          textTransform="uppercase"
          fontWeight="bold"
          rightIcon={<Icon as={isRequirementsExpanded ? ArrowUp : ArrowDown} />}
          onClick={onToggleExpanded}
        >
          {isRequirementsExpanded
            ? "Collapse"
            : `${logic} ${hiddenRequirements} more`}
        </Button>
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.300" : "whiteAlpha.300"}
        opacity={isRequirementsExpanded ? 0 : 1}
        transition={`opacity .1s ${isRequirementsExpanded ? "" : "0.16s"}`}
      />
    </Flex>
  )
}

export default ExpandRequirementsButton
