import { Divider, Flex, Icon, useColorMode } from "@chakra-ui/react"
import Button from "components/common/Button"
import { ArrowDown, ArrowUp } from "phosphor-react"
import { Dispatch, SetStateAction } from "react"

type Props = {
  hiddenRequirements: number
  isRequirementsExpanded: boolean
  setIsRequirementsExpanded: Dispatch<SetStateAction<boolean>>
}

const ExpandRequirementsButton = ({
  hiddenRequirements,
  isRequirementsExpanded,
  setIsRequirementsExpanded,
}: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Flex py={1} width="full" alignItems="center" justifyContent="center">
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
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
          color="gray.400"
          textTransform="uppercase"
          fontWeight="bold"
          rightIcon={<Icon as={isRequirementsExpanded ? ArrowUp : ArrowDown} />}
          onClick={() => setIsRequirementsExpanded(!isRequirementsExpanded)}
        >
          {isRequirementsExpanded ? "Collapse" : `And ${hiddenRequirements} more`}
        </Button>
      </Flex>
      <Divider
        width="full"
        borderColor={colorMode === "light" ? "blackAlpha.400" : "whiteAlpha.400"}
      />
    </Flex>
  )
}

export default ExpandRequirementsButton
