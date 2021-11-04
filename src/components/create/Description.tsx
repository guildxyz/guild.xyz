import { FormControl, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const Description = (): JSX.Element => {
  const { register } = useFormContext()

  return (
    <FormControl>
      <Textarea {...register("description")} size="lg" placeholder="Optional" />
    </FormControl>
  )
}

export default Description
