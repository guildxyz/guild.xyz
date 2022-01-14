import { FormControl, HStack, Input } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useRouter } from "next/router"
import { useFormContext, useWatch } from "react-hook-form"
import IconSelector from "./IconSelector"

const FORBIDDEN_NAMES = ["404", "guild", "hall", "halls", "role", "roles", "guide"]

const NameAndIcon = () => {
  const router = useRouter()
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const urlName = useWatch({ name: "urlName" })

  const validateName = async (value) => {
    if (router.pathname !== "/create-guild") return false
    if (FORBIDDEN_NAMES.includes(urlName)) return "Please pick a different name"
    const alreadyExists = await fetch(
      `${process.env.NEXT_PUBLIC_API}/guild/urlName/${value}`
    ).then(async (response) => response.ok)
    if (alreadyExists) return "Sorry, this guild name is already taken"
  }

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
            validate: validateName,
          })}
        />
      </HStack>
      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default NameAndIcon
