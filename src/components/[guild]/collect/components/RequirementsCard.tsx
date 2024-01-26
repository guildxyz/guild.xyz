import { Stack, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import RoleRequirements from "components/[guild]/Requirements"
import { RoleRequirementsSkeleton } from "components/[guild]/Requirements/RoleRequirements"
import { RoleRequirementsSectionHeader } from "components/[guild]/RoleCard/components/RoleRequirementsSection"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { PropsWithChildren } from "react"
import { Role } from "types"

type Props = {
  role: Role
}

const RequirementsCard = ({ role, children }: PropsWithChildren<Props>) => {
  const requirementsSectionBgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const requirementsSectionBorderColor = useColorModeValue("gray.200", "gray.600")

  const { isOpen: isExpanded, onToggle: onToggleExpanded } = useDisclosure()

  return (
    <CardMotionWrapper>
      <Card w="full" h="max-content">
        <Stack
          position="relative"
          bgColor={requirementsSectionBgColor}
          w="full"
          alignItems="center"
          borderBottomWidth={!!children ? 1 : 0}
          borderColor={requirementsSectionBorderColor}
        >
          <RoleRequirementsSectionHeader />
          {!role ? (
            <RoleRequirementsSkeleton />
          ) : (
            <RoleRequirements
              {...{
                role,
                isExpanded,
                onToggleExpanded,
                isOpen: true,
              }}
            />
          )}
        </Stack>

        {children}
      </Card>
    </CardMotionWrapper>
  )
}
export default RequirementsCard
