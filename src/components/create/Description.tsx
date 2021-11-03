import { FormControl, FormErrorMessage, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

const Description = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isInvalid={errors?.description}>
      <Textarea {...register("description")} />
      <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default Description
