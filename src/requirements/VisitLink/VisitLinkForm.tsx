import {
  Collapse,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { LinkMetadata } from "pages/api/link-metadata"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { RequirementFormProps } from "requirements"
import useSWRImmutable from "swr/immutable"
import parseFromObject from "utils/parseFromObject"

const VisitLinkForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext()

  const link = useWatch({ name: `${baseFieldPath}.data.id` })
  const debounceLink = useDebouncedState(link)

  const { data: metadata, isValidating } = useSWRImmutable<LinkMetadata>(
    debounceLink ? `/api/link-metadata?url=${debounceLink}` : null
  )

  useEffect(() => {
    if (!metadata?.title) return
    setValue(`${baseFieldPath}.data.customName`, `Visit link: [${metadata.title}]`)
  }, [metadata])

  return (
    <FormControl isInvalid={!!parseFromObject(errors, baseFieldPath).data?.id}>
      <FormLabel>Link user has to go to</FormLabel>
      <Input
        {...register(`${baseFieldPath}.data.id`, {
          required: "This field is required",
          pattern: {
            value: /^https:\/\/(.)+\.(.)+$/,
            message: "Invalid URL",
          },
        })}
        placeholder="https://guild.xyz"
      />

      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath).data?.id?.message}
      </FormErrorMessage>

      <Collapse in={!!metadata?.title || isValidating}>
        <FormHelperText>
          {isValidating ? (
            <HStack>
              <Spinner size="xs" />
              <Text as="span">Loading metadata...</Text>
            </HStack>
          ) : (
            metadata?.title
          )}
        </FormHelperText>
      </Collapse>
    </FormControl>
  )
}

export default VisitLinkForm
