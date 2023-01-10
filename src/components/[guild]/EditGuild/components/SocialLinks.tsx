import {
  Circle,
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
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import {
  GlobeHemisphereEast,
  Lightning,
  MediumLogo,
  Plus,
  SpotifyLogo,
  TwitterLogo,
  YoutubeLogo,
} from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import LensLogo from "static/socialIcons/lens.svg"
import MirrorLogo from "static/socialIcons/mirror.svg"
import SubstackLogo from "static/socialIcons/substack.svg"
import {
  GuildFormType,
  SelectOption,
  SocialLinkKey,
  supportedSocialLinks,
} from "types"
import capitalize from "utils/capitalize"

const socialLinkIcons: Record<SocialLinkKey, JSX.Element> = {
  TWITTER: (
    <Circle bgColor="twitter.500" color="white" size={5}>
      <Icon boxSize={3} as={TwitterLogo} />
    </Circle>
  ),
  LENS: (
    <Circle bgColor="BRAND.LENS" color="BRAND.LENSDARK" size={5}>
      <Icon boxSize={3} as={LensLogo} />
    </Circle>
  ),
  YOUTUBE: (
    <Circle bgColor="BRAND.YOUTUBE" color="white" size={5}>
      <Icon boxSize={3} as={YoutubeLogo} />
    </Circle>
  ),
  SPOTIFY: (
    <Circle bgColor="BRAND.SPOTIFY" color="white" size={5}>
      <Icon boxSize={3} as={SpotifyLogo} />
    </Circle>
  ),
  MIRROR: (
    <Circle bgColor="BRAND.MIRROR" color="white" size={5}>
      <Icon boxSize={3} as={MirrorLogo} />
    </Circle>
  ),
  MEDIUM: (
    <Circle bgColor="BRAND.MEDIUM" color="white" size={5}>
      <Icon boxSize={3} as={MediumLogo} />
    </Circle>
  ),
  SUBSTACK: (
    <Circle bgColor="BRAND.SUBSTACK" color="white" size={5}>
      <Icon boxSize={3} as={SubstackLogo} />
    </Circle>
  ),
  SNAPSHOT: (
    <Circle bgColor="white" color="BRAND.SNAPSHOT" size={5}>
      <Icon boxSize={3} as={Lightning} />
    </Circle>
  ),
  WEBSITE: (
    <Circle bgColor="gray.900" color="white" size={5}>
      <Icon boxSize={3} as={GlobeHemisphereEast} />
    </Circle>
  ),
}

const socialLinkOptions: SelectOption[] = supportedSocialLinks.map((socialLink) => ({
  label: capitalize(socialLink.toLowerCase()),
  value: socialLink,
  img: socialLinkIcons[socialLink],
}))

const SocialLinks = (): JSX.Element => {
  const {
    control,
    register,
    unregister,
    setValue,
    formState: { errors },
  } = useFormContext<GuildFormType>()

  const definedSocialLinks = useWatch({ control, name: "socialLinks" })

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {Object.keys(definedSocialLinks ?? {}).map((key) => (
        <GridItem key={key}>
          <FormControl isInvalid={!!errors?.socialLinks?.[key]} isRequired>
            <InputGroup>
              <InputLeftElement>
                {socialLinkOptions.find((sl) => sl.value === key).img}
              </InputLeftElement>
              <Input
                {...register(`socialLinks.${key}`, {
                  required: "This field is required.",
                })}
                placeholder={socialLinkOptions.find((sl) => sl.value === key).label}
              />
              <InputRightElement>
                <CloseButton
                  aria-label="Remove link"
                  size="sm"
                  rounded="full"
                  onClick={() => unregister(`socialLinks.${key}`)}
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
            (sl) => !Object.keys(definedSocialLinks ?? {}).includes(sl.value)
          )}
          onChange={(newValue: SelectOption) =>
            setValue(`socialLinks.${newValue.value}`, "")
          }
          placeholder="Add more"
          value=""
          components={{
            DropdownIndicator: () => <Icon as={Plus} pr={2} boxSize={6} />,
          }}
        />
      </GridItem>
    </SimpleGrid>
  )
}

export default SocialLinks
