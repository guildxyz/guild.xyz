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
import FormErrorMessage from "components/common/FormErrorMessage"
import StyledSelect from "components/common/StyledSelect"
import SocialIcon from "components/[guild]/SocialIcon"
import { Plus } from "phosphor-react"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildFormType, SelectOption, supportedSocialLinks } from "types"
import capitalize from "utils/capitalize"

const socialLinkOptions: SelectOption[] = supportedSocialLinks.map((socialLink) => ({
  label: capitalize(socialLink.toLowerCase()),
  value: socialLink,
  img: <SocialIcon type={socialLink} size="sm" />,
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
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
      {Object.keys(definedSocialLinks ?? {}).map((key) => (
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
          size="lg"
        />
      </GridItem>
    </SimpleGrid>
  )
}

export default SocialLinks
