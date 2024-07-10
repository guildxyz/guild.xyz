import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  SkeletonCircle,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements/types"
import useSWRImmutable from "swr/immutable"
import parseFromObject from "utils/parseFromObject"

const TwitterUserInput = ({ baseFieldPath }: RequirementFormProps) => {
  const { errors } = useFormState()

  const { field } = useController({
    name: `${baseFieldPath}.data.id`,
    rules: {
      required: "This field is required",
    },
  })

  const debouncedUsername = useDebouncedState(field.value)

  const { data: twitterAvatar, isValidating } = useSWRImmutable(
    // debouncedUsername && TWITTER_HANDLE_REGEX.test(debouncedUsername)
    false ? `/v2/third-party/twitter/users/${debouncedUsername}/avatar` : null
  )

  return (
    <FormControl
      isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
    >
      <FormLabel>Username</FormLabel>

      <HStack>
        <InputGroup>
          <InputLeftElement>@</InputLeftElement>
          <Input
            {...field}
            pl={7}
            onChange={({ target: { value } }) => {
              if (value.length <= 0) return field.onChange(value)

              const splittedLink = value.split("?")[0].split("/")

              return field.onChange(splittedLink.at(-1))
            }}
          />
        </InputGroup>
        {debouncedUsername?.length > 0 && (
          <SkeletonCircle
            boxSize={10}
            flexShrink={0}
            border="1px solid var(--chakra-colors-whiteAlpha-300)"
            overflow="hidden"
            isLoaded={!isValidating}
          >
            <Img
              src={twitterAvatar ?? "/default_twitter_icon.png"}
              alt="Twitter avatar"
              boxSize={10}
            />
          </SkeletonCircle>
        )}
      </HStack>
      <FormHelperText>Paste username of profile URL</FormHelperText>
      <FormErrorMessage>
        {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      </FormErrorMessage>
    </FormControl>
  )
}

export default TwitterUserInput
