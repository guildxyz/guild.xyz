import { HStack, Icon, Spacer } from "@chakra-ui/react"
import { DotsSixVertical } from "@phosphor-icons/react"
import { RequirementProvider } from "components/[guild]/Requirements/components/RequirementContext"
import { REQUIREMENT_DISPLAY_COMPONENTS } from "requirements/requirementDisplayComponents"
import { Requirement } from "types"
import RequirementBaseCard from "./RequirementBaseCard"

type Props = {
  requirement: Requirement
}

export const DraggableRequirementCard = ({ requirement }: Props) => {
  if (!requirement) return null
  const RequirementComponent = REQUIREMENT_DISPLAY_COMPONENTS[requirement.type]

  const showViewOriginal =
    requirement.data?.customName || requirement.data?.customImage

  return (
    <HStack spacing={4} cursor="grab" mb="3">
      <HStack spacing={1} userSelect="none">
        <RequirementBaseCard>
          <RequirementProvider requirement={requirement}>
            <RequirementComponent
              showViewOriginal={showViewOriginal}
              rightElement={<Icon as={DotsSixVertical} />}
            />
          </RequirementProvider>
        </RequirementBaseCard>
      </HStack>
      <Spacer />
    </HStack>
  )
}
