import { FormControl, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import React from "react"
import { useFormContext, useFormState } from "react-hook-form"
import slugify from "slugify"

const FORBIDDEN_NAMES = [
  "404",
  "index",
  "dcauth",
  "create-guild",
  "guild",
  "role",
  "roles",
  "guide",
]

const checkUrlName = (urlName: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/guild/${urlName}`).then(
    async (response) => response.ok && response.status !== 204
  )

const UrlName = () => {
  const { errors } = useFormState()
  const { register, setError, setValue } = useFormContext()

  const { urlName: currentUrlName } = useGuild()

  return (
    <FormControl isRequired isInvalid={!!errors?.urlName}>
      <InputGroup size="lg" maxWidth="sm">
        <InputLeftAddon>guild.xyz/</InputLeftAddon>
        <Input
          {...register("urlName", {
            required: "This field is required",
            onChange: (event) => {
              setValue("urlName", slugify(event.target.value, { trim: false }))
            },
            onBlur: (event) => {
              if (!event.target.value.length) return

              const newUrlName = slugify(event.target.value)
              setValue("urlName", newUrlName)

              if (FORBIDDEN_NAMES.includes(newUrlName))
                setError("urlName", { message: "Please pick a different name" })

              checkUrlName(newUrlName).then((alreadyExists) => {
                if (alreadyExists && currentUrlName !== newUrlName)
                  setError("urlName", {
                    message: "Sorry, this guild name is already taken",
                  })
              })
            },
          })}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.urlName?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default UrlName
export { FORBIDDEN_NAMES }
