import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useFormState } from "react-hook-form"
import fetcher from "utils/fetcher"
import slugify from "utils/slugify"

const checkUrlName = (urlName: string) =>
  fetcher(`/v2/guilds/${urlName}`)
    .then(() => true)
    .catch(() => false)

const UrlName = () => {
  const { errors } = useFormState()
  const { register, setError, clearErrors, getFieldState } = useFormContext()
  const { urlName: currentUrlName } = useGuild()

  return (
    <FormControl isInvalid={!!errors?.urlName} isRequired>
      <FormLabel>URL name</FormLabel>
      <InputGroup size="lg">
        <InputLeftAddon>guild.xyz/</InputLeftAddon>
        <Input
          {...register("urlName", {
            required: "This field is required",
            validate: (value: string) => {
              const slugified = slugify(value)
              if (value !== slugified)
                return `Invalid URL name, try using "${slugified}" instead`
            },
          })}
          onBlur={(event) => {
            if (getFieldState("urlName").error) return
            checkUrlName(event.target.value).then((alreadyExists) => {
              if (alreadyExists && currentUrlName !== event.target.value) {
                setError("urlName", {
                  message: "Sorry, this guild name is already taken",
                })
              } else {
                clearErrors("urlName")
              }
            })
          }}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.urlName?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default UrlName
