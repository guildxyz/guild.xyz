import { FormControl, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

const Description = (): JSX.Element => {
  const { register } = useFormContext<GuildFormType>()

  return (
    <FormControl>
      <Textarea {...register("description")} size="lg" placeholder="Optional" />
    </FormControl>
  )
}

export default Description
