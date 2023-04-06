import { FormControl, FormLabel, Textarea } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import { GuildFormType } from "types"

const Description = ({ isDisabled = false, ...rest }): JSX.Element => {
  const { register } = useFormContext<GuildFormType>()

  return (
    <FormControl isDisabled={isDisabled} {...rest}>
      <FormLabel>Description</FormLabel>
      <Textarea
        {...register("description")}
        size="lg"
        placeholder="Optional"
        isDisabled={isDisabled}
      />
    </FormControl>
  )
}

export default Description
