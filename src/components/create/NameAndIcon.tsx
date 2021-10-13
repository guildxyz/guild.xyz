import { FormControl, FormErrorMessage, HStack, Input } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import IconSelector from "../create-guild/IconSelector"

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
              input?.trim() !== "404" || 'Name "404" is not allowed.',
          })}
        />
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
