import { FormControl, Input, ResponsiveValue } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"

type Props = {
  isDisabled?: boolean
  width?: ResponsiveValue<string>
}

export const GUILD_NAME_REGEX = /.*[a-zA-Z].*/

const Name = ({
  isDisabled,
  width = { base: "full", md: "sm" },
}: Props): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl
      isRequired
      isInvalid={!!errors?.name}
      isDisabled={isDisabled}
      width={width}
    >
      <Input
        size="lg"
        {...register("name", {
          required: "This field is required.",
          maxLength: {
            value: 50,
            message: "The maximum possible name length is 50 characters",
          },
          pattern: {
            value: GUILD_NAME_REGEX,
            message: "Guild name should include at least one letter",
          },
        })}
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{errors?.name?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Name
