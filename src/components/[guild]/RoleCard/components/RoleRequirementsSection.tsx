import { Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RoleRequirementsSection = ({
  isOpen = true,
  children,
}: PropsWithChildren<any>) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Flex
      direction="column"
      bgColor={isOpen && requirementsSectionBgColor}
      borderLeftWidth={{ base: 0, md: 1 }}
      borderLeftColor={isOpen ? requirementsSectionBorderColor : "transparent"}
      transition="background .2s"
      // Card's `overflow: clip` isn't enough in Safari
      borderTopRightRadius={{ md: "2xl" }}
      borderBottomRightRadius={{ md: "2xl" }}
      pos="relative"
    >
      {children}
    </Flex>
  )
}

const RoleRequirementsSectionHeader = ({
  isOpen = true,
  children,
}: PropsWithChildren<any>) => (
  <HStack
    w="full"
    p={5}
    pb={0}
    mb={{ base: 4, md: 6 }}
    transform={!isOpen && "translateY(10px)"}
    transition="transform .2s"
  >
    <Text
      as="span"
      mt="1"
      mr="2"
      fontSize="xs"
      fontWeight="bold"
      color="gray"
      textTransform="uppercase"
      noOfLines={1}
      opacity={isOpen ? 1 : 0}
      pointerEvents={!isOpen ? "none" : "auto"}
      transition="opacity .2s"
    >
      Unlock rewards
    </Text>
    {children}
  </HStack>
)

export default RoleRequirementsSection
export { RoleRequirementsSectionHeader }
