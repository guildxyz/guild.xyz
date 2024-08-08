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
import { LinkMetadata } from "app/api/link-metadata/types"
import FormErrorMessage from "components/common/FormErrorMessage"
import useDebouncedState from "hooks/useDebouncedState"
import { useController, useFormContext } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import useSWRImmutable from "swr/immutable"
import parseFromObject from "utils/parseFromObject"

const VisitLinkForm = ({ baseFieldPath }: RequirementFormProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()

  const {
    field: { onChange, ...field },
  } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
      pattern: {
        value: /^https:\/\/(.)+\.(.)+$/,
        message: "Invalid URL",
      },
    },
  })

  const debounceLink = useDebouncedState(field.value)

  const error = !!parseFromObject(errors, baseFieldPath).data?.id

  const { data: metadata, isValidating } = useSWRImmutable<LinkMetadata>(
    debounceLink && !error ? `/api/link-metadata?url=${debounceLink}` : null,
    {
      onSuccess: (data, _key, _config) => {
        if (!data?.title) return
        setValue(`${baseFieldPath}.data.customName`, `Visit link: [${data.title}]`)
      },
    }
  )

  return (
    <FormControl isInvalid={error}>
      <FormLabel>Link user has to go to</FormLabel>
      <Input
        {...field}
        placeholder="https://guild.xyz"
        onChange={(e) => {
          const position = e.target.selectionStart
          try {
            const parsedUrl = new URL(e.target.value).href
            onChange(parsedUrl)
          } catch {
            onChange(e.target.value)
          }
          // The cursor's position was always set to e.target.value.length without timeout
          setTimeout(() => {
            e.target.setSelectionRange(position, position)
          })
        }}
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
