import { FormControl, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { CreateGuildFormType } from "types"

const Description = (): JSX.Element => {
  const { register } = useFormContext<CreateGuildFormType>()

  return (
    <FormControl>
      <Textarea {...register("description")} size="lg" placeholder="Optional" />
    </FormControl>
  )
}

export default Description
