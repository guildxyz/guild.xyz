import { Button } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { useRequirementContext } from "./RequirementContext"

const ResetRequirementButton = () => {
  const { id } = useRequirementContext()
  const { control, setValue } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)

  const onReset = () => {
    setValue(`requirements.${index}.data.customName`, "", {
      shouldDirty: true,
    })
    setValue(`requirements.${index}.data.customImage`, "", {
      shouldDirty: true,
    })
  }

  return (
    <Button size={"xs"} onClick={onReset}>
      Reset to original
    </Button>
  )
}

export default ResetRequirementButton
