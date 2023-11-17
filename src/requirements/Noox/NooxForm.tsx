import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import parseFromObject from "utils/parseFromObject"
import useNooxBadge, { NUMBER_REGEX } from "./hooks/useNooxBadge"

export type NooxBadge = {
  id: string
  name: string
  descriptionEligibility: string
  description: string
  image: string
  imageBadge: string
  imageThumbnail: string
}

const NOOX_BADGE_URL_REGEX = /^https:\/\/noox\.world\/badge\/(\d+)$/

const NooxForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    formState: { errors },
  } = useFormContext()

  const {
    field: { onChange, ...idFieldProps },
  } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
      validate: (value) => NUMBER_REGEX.test(value) || "Invalid badge ID",
    },
  })

  const { badgeMetaData, isLoading, isError } = useNooxBadge(idFieldProps.value)

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isRequired
        isInvalid={isError || parseFromObject(errors, baseFieldPath)?.data?.id}
      >
        <FormLabel>Badge:</FormLabel>

        <InputGroup>
          {badgeMetaData && (
            <InputLeftElement>
              <OptionImage
                img={badgeMetaData.image_thumbnail?.replace(
                  "ipfs://",
                  "https://ipfs.io/ipfs/"
                )}
                alt={badgeMetaData.name}
              />
            </InputLeftElement>
          )}

          <Input
            {...idFieldProps}
            onChange={(e) => {
              const newValue = e.target.value
              const [, badgeId] = newValue.match(NOOX_BADGE_URL_REGEX) ?? []
              onChange(badgeId ?? newValue)
            }}
            placeholder="Paste noox.world badge URL"
          />
        </InputGroup>

        <FormErrorMessage>
          {(isError && "Couldn't fetch Noox badge") ||
            parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>

        <FormHelperText>
          {isLoading ? (
            <HStack>
              <Spinner size="xs" />
              <Text as="span">Loading badge...</Text>
            </HStack>
          ) : (
            badgeMetaData?.name
          )}
        </FormHelperText>
      </FormControl>
    </Stack>
  )
}

export default NooxForm
