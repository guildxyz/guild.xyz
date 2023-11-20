import { Box, Input } from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"

type Props = {
  id: number
}

const RequirementNameEditor = ({ id }: Props) => {
  const { register, control } = useFormContext()
  const requirements = useWatch({ name: "requirements", control })
  const index = requirements.findIndex((requirement) => requirement.id === id)

  return (
    <Box position="relative" w={"xs"} display="inline-block">
      <Input
        {...register(`requirements.${index}.data.customName`)}
        size={"sm"}
        bg="transparent"
        position="absolute"
        top={"-20px"}
        autoFocus
      />
    </Box>
  )
}

export default RequirementNameEditor
