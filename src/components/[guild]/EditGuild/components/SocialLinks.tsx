import {
  CloseButton,
  FormControl,
  GridItem,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
} from "@chakra-ui/react"
import SocialIcon from "components/[guild]/SocialIcon"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { Plus } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  GuildFormType,
  SelectOption,
  SocialLinkKey,
  supportedSocialLinks,
} from "types"
import capitalize from "utils/capitalize"
import { z } from "zod"

const socialLinkUserPaths = {
  TWITTER: "https://x.com/",
  YOUTUBE: "https://youtube.com/",
  SPOTIFY: "https://open.spotify.com/user/",
  MEDIUM: "https://medium.com/",
  GITHUB: "https://github.com/",
} as const satisfies Partial<Record<SocialLinkKey, string>>

const socialLinkOptions: SelectOption[] = supportedSocialLinks.map((socialLink) => ({
  label: capitalize(socialLink.toLowerCase()),
  value: socialLink,
  img: <SocialIcon type={socialLink} size="sm" />,
}))

const SocialLinks = (): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const definedSocialLinks = useWatch({ control, name: "socialLinks" })

  const validateUrl = (input: string) => {
    const { success } = z.string().url().safeParse(input)
    return success || "Invalid link format."
  }
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
      {Object.entries(definedSocialLinks ?? {})
        .filter(([, value]) => typeof value !== "undefined")
        .map(([key]) => (
          <GridItem key={key}>
            <FormControl isInvalid={!!errors?.socialLinks?.[key]} isRequired>
              <InputGroup size="lg">
                <InputLeftElement>
                  {socialLinkOptions.find((sl) => sl.value === key).img}
                </InputLeftElement>
                <Input
                  type="url"
                  {...register(`socialLinks.${key}`, {
                    required: "This field is required.",
                    validate: validateUrl,
                  })}
                  placeholder={
                    socialLinkOptions.find((sl) => sl.value === key).label
                  }
                />
                <InputRightElement>
                  <CloseButton
                    aria-label="Remove link"
                    size="sm"
                    rounded="full"
                    onClick={() =>
                      setValue(`socialLinks.${key}`, undefined, {
                        shouldDirty: true,
                      })
                    }
                  />
                </InputRightElement>
              </InputGroup>

              <FormErrorMessage>
                {errors?.socialLinks?.[key]?.message}
              </FormErrorMessage>
            </FormControl>
          </GridItem>
        ))}
      <GridItem>
        <StyledSelect
          options={socialLinkOptions.filter(
            (sl) => typeof definedSocialLinks?.[sl.value] === "undefined"
          )}
          onChange={(newValue: SelectOption) =>
            setValue(
              `socialLinks.${newValue.value}`,
              socialLinkUserPaths[newValue.value] ?? ""
            )
          }
          placeholder="Add more"
          value=""
          components={{
            DropdownIndicator: () => <Icon as={Plus} pr={2} boxSize={6} />,
          }}
          size="lg"
        />
      </GridItem>
    </SimpleGrid>
  )
}

export default SocialLinks
