import { Button } from "@chakra-ui/react"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { Requirement } from "types"
import { useRequirementContext } from "./RequirementContext"

export const getDefaultVisitLinkCustomName = (
  requirementData: Requirement["data"],
) => {
  return `Visit link: [${requirementData.id}]`
}

const ResetRequirementButton = () => {
  const requirement = useRequirementContext()
  const { onSubmit, isLoading } = useEditRequirement(requirement.roleId)

  const resetCustomName =
    requirement.type === "LINK_VISIT"
      ? getDefaultVisitLinkCustomName(requirement.data)
      : ""

  return (
    <Button
      size={"sm"}
      isLoading={isLoading}
      onClick={() =>
        onSubmit({
          ...requirement,
          data: {
            ...requirement.data,
            customName: resetCustomName,
            customImage: "",
          },
        })
      }
    >
      Reset to original
    </Button>
  )
}

export default ResetRequirementButton
