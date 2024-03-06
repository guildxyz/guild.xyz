import {
  Alert,
  AlertDescription,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Img,
  Input,
  InputGroup,
  InputLeftElement,
  SkeletonCircle,
  chakra,
} from "@chakra-ui/react"
import useDebouncedState from "hooks/useDebouncedState"
import { useController, useFormState } from "react-hook-form"
import { RequirementFormProps } from "requirements"
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
    <>
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          X <chakra.span opacity={0.5}>(formerly Twitter)</chakra.span>{" "}
          authentication limits to about 450 requests every 15 minutes. Users may
          need to wait if this threshold is exceeded.
        </AlertDescription>
      </Alert>
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.data?.id?.message}
      >
        <FormLabel>Username</FormLabel>

        <HStack>
          <InputGroup>
            <InputLeftElement>@</InputLeftElement>
            <Input {...field} pl={7} />
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
        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.data?.id?.message}
        </FormErrorMessage>
      </FormControl>
    </>
  )
}

export default TwitterUserInput
