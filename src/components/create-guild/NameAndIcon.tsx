import { FormControl, HStack, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import IconSelector from "./IconSelector"

const forbiddenNames = ["404", "guild", "hall", "halls", "role", "roles", "guide"]

const NameAndIcon = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const urlName = useWatch({ name: "urlName" })

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <HStack spacing={2}>
        <IconSelector />
        <Input
          size="lg"
          maxWidth="sm"
          {...register("name", {
            required: "This field is required.",
            maxLength: {
              value: 50,
              message: "The maximum possible name length is 50 characters",
            },
            validate: () =>
              !forbiddenNames.includes(urlName) || "Please pick a different name.",
          })}
        />
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
