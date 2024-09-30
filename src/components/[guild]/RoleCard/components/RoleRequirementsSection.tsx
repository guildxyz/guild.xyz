import { cn } from "@/lib/utils"
import { HStack, Text } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RoleRequirementsSection = ({
  isOpen = true,
  children,
}: PropsWithChildren<any>) => {
  return (
    <div
      className={cn("flex flex-col border-transparent transition-colors", {
        "border-border border-t bg-card-secondary md:border-t-0 md:border-l": isOpen,
      })}
    >
      {children}
    </div>
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

export { RoleRequirementsSection, RoleRequirementsSectionHeader }
