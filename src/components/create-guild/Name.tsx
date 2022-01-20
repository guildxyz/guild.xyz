import { FormControl, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import React from "react"
import { useFormContext } from "react-hook-form"

const Name = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <Input
        size="lg"
        maxWidth="sm"
        {...register("name", {
          required: "This field is required.",
          maxLength: {
            value: 50,
            message: "The maximum possible name length is 50 characters",
          },
        })}
      />
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default Name
