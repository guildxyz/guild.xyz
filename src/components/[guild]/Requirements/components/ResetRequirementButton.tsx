import { Button } from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { useFormContext, useWatch } from "react-hook-form"
import { Requirement } from "types"
import { useRequirementContext } from "./RequirementContext"

type Props = { requirement: Requirement }

export const getDefaultVisitLinkCustomName = (
  requirementData: Requirement["data"]
) => `Visit link: [${requirementData.id}]`

const ResetNewRequirementButton = ({ requirement }: Props) => {
  const { control, setValue } = useFormContext<Schemas["RoleCreationPayload"]>()
  const requirements = useWatch({ name: "requirements", control })

  // The ID field doesn't exist in the schema, but react-hook-form will generate a uuid for each field, so it's safe to use it here
  const index = requirements?.findIndex(
    (req) => "id" in req && req.id === requirement.id
  )

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

const ResetExistingRequirementButton = ({ requirement }: Props) => {
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
  if (typeof requirement.id === "number")
    return <ResetExistingRequirementButton {...{ requirement }} />

  return <ResetNewRequirementButton {...{ requirement }} />
}

export default ResetRequirementButton
