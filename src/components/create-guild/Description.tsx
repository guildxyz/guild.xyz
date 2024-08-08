import { FormControl, FormLabel, Textarea } from "@chakra-ui/react"
import { EditGuildForm } from "components/[guild]/EditGuild/types"
import { useFormContext } from "react-hook-form"

const Description = ({ isDisabled = false, ...rest }): JSX.Element => {
  const { register } = useFormContext<EditGuildForm>()

  return (
    <FormControl isDisabled={isDisabled} {...rest}>
      <FormLabel>Description</FormLabel>
      <Textarea
        {...register("description")}
        size="lg"
        placeholder="Optional"
        _placeholder={{ color: "chakra-placeholder-color" }}
        isDisabled={isDisabled}
      />
    </FormControl>
  )
}

export default Description
