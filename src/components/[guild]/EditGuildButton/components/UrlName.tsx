import { FormControl, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useGuild from "components/[guild]/hooks/useGuild"
import useDebouncedState from "hooks/useDebouncedState"
import React, { useEffect } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import slugify from "slugify"

const FORBIDDEN_NAMES = [
  "404",
  "index",
  "dcauth",
  "create-guild",
  "guild",
  "hall",
  "halls",
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

  const urlName = useWatch({ name: "urlName" })

  const debouncedUrlName = useDebouncedState(urlName)

  useEffect(() => {
    console.log({ urlName, currentUrlName })
    if (
      !currentUrlName ||
      !debouncedUrlName ||
      currentUrlName.length <= 0 ||
      debouncedUrlName.lenght <= 0
    )
      return
    checkUrlName(debouncedUrlName).then((alreadyExists) => {
      if (alreadyExists && currentUrlName !== debouncedUrlName)
        setError("urlName", { message: "Sorry, this guild name is already taken" })
    })
  }, [debouncedUrlName])

  return (
    <FormControl isRequired isInvalid={!!errors?.urlName}>
      <InputGroup size="lg" maxWidth="sm">
        <InputLeftAddon>guild.xyz/</InputLeftAddon>
        <Input
          {...register("urlName", {
            required: "This field is required",
            validate: (value) =>
              !FORBIDDEN_NAMES.includes(value) || "Please pick a different name",
            onBlur: (event) => {
              setValue("urlName", slugify(event.target.value), { shouldTouch: true })
            },
          })}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.urlName?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default UrlName
