import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import IconSelector from "../create-guild/IconSelector"

const forbiddenNames = ["404", "groups"]

const NameAndIcon = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

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
            validate: (input) =>
              !forbiddenNames.includes(input?.trim()) ||
              "Please pick a different name.",
          })}
        />
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
