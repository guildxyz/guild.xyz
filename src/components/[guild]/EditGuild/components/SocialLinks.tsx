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
import { SocialLinks as SocialLinksType, consts } from "@guildxyz/types"
import { Plus } from "@phosphor-icons/react"
import SocialIcon from "components/[guild]/SocialIcon"
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import { useFormContext, useWatch } from "react-hook-form"
import { SelectOption, SocialLinkKey } from "types"
import capitalize from "utils/capitalize"
import { z } from "zod"
import { EditGuildForm } from "../types"

const socialLinkUserPaths = {
  TWITTER: "https://x.com/",
  YOUTUBE: "https://youtube.com/",
  SPOTIFY: "https://open.spotify.com/user/",
  MEDIUM: "https://medium.com/",
  GITHUB: "https://github.com/",
  LENS: "",
  MIRROR: "",
  SNAPSHOT: "",
  SOUND: "",
  SUBSTACK: "",
  WARPCAST: "https://warpcast.com/",
  WEBSITE: "",
} as const satisfies Record<SocialLinkKey, string>

const socialLinkOptions = consts.SocialLinks.map((socialLink) => ({
  label: capitalize(socialLink.toLowerCase()),
  value: socialLink,
  img: <SocialIcon type={socialLink} size="sm" />,
})) satisfies SelectOption[]

const SocialLinks = (): JSX.Element => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<EditGuildForm>()

  const definedSocialLinks = useWatch({ control, name: "socialLinks" })

  const validateUrl = (input?: string) => {
    const { success } = z.string().url().safeParse(input)
    return success || "Invalid link format."
  }
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
      {(
        Object.entries(definedSocialLinks ?? {}) as [keyof SocialLinksType, string][]
      )
        .filter(([, value]) => typeof value !== "undefined")
        .map(([key]) => {
          const socialLinkOption = socialLinkOptions.find((sl) => sl.value === key)

          if (!socialLinkOption) return null

          return (
            <GridItem key={key}>
              <FormControl isInvalid={!!errors?.socialLinks?.[key]} isRequired>
                <InputGroup size="lg">
                  <InputLeftElement>{socialLinkOption.img}</InputLeftElement>
                  <Input
                    type="url"
                    {...register(`socialLinks.${key}`, {
                      required: "This field is required.",
                      validate: validateUrl,
                    })}
                    placeholder={socialLinkOption.label}
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
          )
        })}
      <GridItem>
        <StyledSelect
          options={socialLinkOptions.filter(
            (sl) => typeof definedSocialLinks?.[sl.value] === "undefined"
          )}
          onChange={(newValue: (typeof socialLinkOptions)[number]) =>
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
