import { FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import SocialIcon from "components/[guild]/SocialIcon"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext } from "react-hook-form"

const TwitterUrlInput = (): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<{ twitterUrl: string }>()

  return (
    <FormControl isInvalid={!!errors?.twitterUrl} isRequired>
      <InputGroup size="lg">
        <InputLeftElement>
          <SocialIcon type="TWITTER" size="sm" />
        </InputLeftElement>
        <Input
          maxW={{ base: "full", sm: "sm" }}
          placeholder="Twitter profile URL"
          {...register("twitterUrl", {
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
      <FormErrorMessage>{errors?.twitterUrl?.message}</FormErrorMessage>
    </FormControl>
  )
}

export default TwitterUrlInput
