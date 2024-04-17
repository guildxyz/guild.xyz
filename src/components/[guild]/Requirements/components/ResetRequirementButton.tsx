import { Button } from "@chakra-ui/react"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { useFormContext, useWatch } from "react-hook-form"
import { Requirement } from "types"
import { useRequirementContext } from "./RequirementContext"

export const getDefaultVisitLinkCustomName = (
  requirementData: Requirement["data"]
) => `Visit link: [${requirementData.id}]`

const ResetNewRequirementButton = ({ requirement }) => {
  const { control, setValue } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  /**
   * We don't get formFieldId from requirements (and useFieldArray would give a new
   * formFieldId), so we get the actual requirement's index by comparing object
   * value. It works until there're two requirements that are exactly identical,
   * which is not a usecase
   */
  const index = requirements?.findIndex((req) => {
    const reqWithoutFormFieldId = structuredClone(requirement)
    delete reqWithoutFormFieldId.formFieldId
    return JSON.stringify(req) === JSON.stringify(reqWithoutFormFieldId)
  })

  const onReset = () => {
    setValue(`requirements.${index}.data.customName`, "")
    setValue(`requirements.${index}.data.customImage`, "")
  }

  return (
    <Button size={"sm"} onClick={onReset} flexShrink={0}>
      Reset to original
    </Button>
  )
}

const ResetExistingRequirementButton = ({ requirement }) => {
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
      flexShrink={0}
    >
      Reset to original
    </Button>
  )
}

const ResetRequirementButton = () => {
  const requirement = useRequirementContext()
  if (requirement.id) return <ResetExistingRequirementButton {...{ requirement }} />

  return <ResetNewRequirementButton {...{ requirement }} />
}

export default ResetRequirementButton
