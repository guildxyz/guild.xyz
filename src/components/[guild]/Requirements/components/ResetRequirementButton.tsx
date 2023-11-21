import { Button } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  id: number
}

const ResetRequirementButton = ({ id }: Props) => {
  const { control, setValue } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)

  const onReset = () => {
    setValue(`requirements.${index}.data.customName`, undefined, {
      shouldDirty: true,
    })
    setValue(`requirements.${index}.data.customImage`, undefined, {
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
