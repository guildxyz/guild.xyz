import { FormControl, Input, ResponsiveValue } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"

type Props = {
  isDisabled?: boolean
  width?: ResponsiveValue<string>
}

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
        })}
        isDisabled={isDisabled}
      />
      <FormErrorMessage>{errors?.name?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default Name
