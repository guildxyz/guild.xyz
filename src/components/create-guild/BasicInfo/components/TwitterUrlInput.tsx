import { FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import SocialIcon from "components/[guild]/SocialIcon"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType } from "types"

const TwitterUrlInput = (): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<GuildFormType>()

  const value = useWatch({ control, name: "socialLinks.TWITTER" })

  useEffect(() => {
    if (!dirtyFields.socialLinks?.TWITTER) return
    setValue("roles.1.requirements.0.data.id", value?.split("/").slice(-1)[0])
  }, [dirtyFields, value])

  return (
    <FormControl isInvalid={!!errors?.socialLinks?.TWITTER} isRequired>
      <InputGroup size="lg">
        <InputLeftElement>
          <SocialIcon type="TWITTER" size="sm" />
        </InputLeftElement>
        <Input
          maxW={{ base: "full", sm: "sm" }}
          placeholder="Twitter profile URL"
          {...register("socialLinks.TWITTER", {
            required: "This field is required.",
            validate: (v) =>
              ((v.includes("twitter.com") || v.includes("x.com")) &&
                v.includes("/") &&
                !!v.split("/").slice(-1)[0]?.length) ||
              "Invalid Twitter URL",
            shouldUnregister: true,
          })}
        />
      </InputGroup>
      <FormErrorMessage>{errors?.socialLinks?.TWITTER?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default TwitterUrlInput
