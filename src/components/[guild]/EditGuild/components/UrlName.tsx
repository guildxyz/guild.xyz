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
  const { register, setError, clearErrors, setValue } = useFormContext()

  const { urlName: currentUrlName } = useGuild()

  return (
    <FormControl isInvalid={!!errors?.urlName} isRequired>
      <FormLabel>URL name</FormLabel>
      <InputGroup size="lg">
        <InputLeftAddon>guild.xyz/</InputLeftAddon>
        <Input
          {...register("urlName")}
          onChange={(event) => {
            setValue("urlName", slugify(event.target.value), {
              shouldDirty: true,
            })
          }}
          onBlur={(event) => {
            if (!event.target.value.length) {
              setError("urlName", { message: "This field is required" })
              return
            }

            const newUrlName = slugify(event.target.value)
            setValue("urlName", newUrlName, { shouldDirty: true })

            checkUrlName(newUrlName).then((alreadyExists) => {
              if (alreadyExists && currentUrlName !== newUrlName)
                setError("urlName", {
                  message: "Sorry, this guild name is already taken",
                })
              return
            })

            clearErrors("urlName")
          }}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.urlName?.message as string}</FormErrorMessage>
    </FormControl>
  )
}

export default UrlName
