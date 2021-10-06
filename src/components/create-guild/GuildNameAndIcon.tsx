import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"
import IconSelector from "./IconSelector"

const GuildNameAndIcon = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <FormControl isRequired isInvalid={errors?.name}>
      <InputGroup size="lg">
        <InputLeftAddon p="0" overflow="hidden">
          <IconSelector />
        </InputLeftAddon>
        <Input
          maxWidth="sm"
          {...register("name", {
            required: "This field is required.",
            maxLength: {
              value: 50,
              message: "The maximum possible name length is 50 characters",
            },
          })}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default GuildNameAndIcon
